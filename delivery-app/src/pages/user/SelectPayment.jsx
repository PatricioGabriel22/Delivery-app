/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { Fragment, useEffect, useState } from "react";
import { useShoppingContext } from "@context/ShoppingContext";
import { useNavigate } from "react-router-dom";

import { RiCashLine } from "react-icons/ri";
import { FaAddressCard } from "react-icons/fa";
import { Copy } from "lucide-react";
import toast from "react-hot-toast";

import PaymentBTN from "@components/user/PaymentBTN";
import CancelarCompraBTN from "../../components/user/CancelarCompraBTN";
import { useBistroContext } from "../../context/BistrosContext";

export default function SelectPayment() {
  const navigate = useNavigate();

  const { importeTotal } = useShoppingContext();
  const { bistroInfo } = useBistroContext();

  const [paymentMethods, setPaymentMethods] = useState(
    JSON.parse(localStorage.getItem("paymentMethods")) || bistroInfo.mediosDePago
  );

  const [selectMethod, setSelectMethod] = useState("");
  const [verPagosOnline, setVerPagosOnline] = useState(false);

  const copiarAlPortapapeles = async (metodoElegido, alias) => {
    try {
      await navigator.clipboard.writeText(alias);
      toast.success(`Copiaste el alias de ${metodoElegido}`);
    } catch (err) {
      console.error("Error al copiar", err);
    }
  };

  useEffect(() => {
    if (importeTotal === 0) {
      navigate("/profile");
    }
  }, []);

  return (
    <Fragment>
      <div className="flex flex-col justify-center mt-15">
        <CancelarCompraBTN
          pedidoID={localStorage.getItem("pedidoID")}
          preOrdenID={localStorage.getItem("preOrdenID")}
          bistroID={localStorage.getItem("bistroID") || bistroInfo._id}
        />

        <p className="font-bold text-4xl text-center">Seleccionar método de pago</p>
        <span className="w-[85%] md:w-[50%] h-[1px] bg-red-600 m-2 self-center" />

        <div className="flex flex-col items-center justify-center">
          {/* Mostrar botón para Efectivo */}
          {paymentMethods
            .filter((method) => method.medio === "Efectivo")
            .map((method, index) => (
              <span
                key={index}
                className={`w-full md:w-90 cursor-pointer font-semibold flex flex-row p-3 gap-2 m-2 justify-center items-center rounded ${
                  selectMethod === method.medio ? "bg-green-800" : ""
                } hover:bg-green-800`}
                onClick={() => {
                  setSelectMethod(method.medio);
                  setVerPagosOnline(false);
                }}
              >
                <RiCashLine size={40} className="text-green-400" />
                <p>{method.medio}</p>
              </span>
            ))}

          {/* Botón para desplegar medios online */}
          <div className="flex flex-col w-full md:w-90">
            <div
                className={`cursor-pointer flex flex-row justify-center items-center p-3 gap-2 m-2 ${selectMethod !== 'Efectivo' ? "bg-sky-800" : ""} hover:bg-sky-800 rounded`}

              onClick={() => {
                setVerPagosOnline(!verPagosOnline);
                setSelectMethod("");
              }}
            >
              <FaAddressCard size={40} className="text-sky-400" />
              <p>Ver medios de pago online</p>
            </div>

            {/* Lista de métodos online */}
            {verPagosOnline &&
              paymentMethods
                .filter((method) => method.medio !== "Efectivo")
                .map((method, index) => (
                  <span
                    key={index}
                    className={`cursor-pointer font-semibold flex flex-row p-3 gap-2 m-2 justify-center items-center rounded border-2 border-sky-900 ${
                      selectMethod === method.medio ? "bg-sky-300 text-black" : "text-white"
                    }`}
                    onClick={() => setSelectMethod(method.medio)}
                  >
                    <div className="flex flex-col text-center w-full gap-y-5">
                      <p className="text-xl">{method.medio}</p>

                      <p
                        className="flex flex-row items-center justify-center gap-x-2"
                        onClick={() =>
                          copiarAlPortapapeles(method.medio, method.alias)
                        }
                      >
                        Alias: {method.alias} <Copy size={16} />
                      </p>

                      <p>A nombre de: {method.propietario}</p>
                    </div>
                  </span>
                ))}
          </div>
        </div>

        <PaymentBTN paymentMethod={selectMethod} importeTotal={importeTotal} />
      </div>
    </Fragment>
  );
}
