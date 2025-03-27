// import {useState } from 'react';
import Nav from "../components/Nav";
import Card from "../components/Card";
import { useLoginContext } from "../context/LoginContext";

export default function Home() {



  const {renderORLocalURL} = useLoginContext()
  console.log(renderORLocalURL)





  return (
    <div className="flex flex-col min-h-screen items-center">
      <h1 className="p-6">Victorina a domicilio!</h1>

      <Card/>

      <Nav />
    </div>
  );
}
