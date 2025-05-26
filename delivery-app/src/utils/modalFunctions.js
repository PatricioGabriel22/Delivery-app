export   function openCloseEditPreviewModal(modalTarget,action){

    if(action === 'open'){

      modalTarget.current.showModal()
      modalTarget.current.scrollTop = 0

    }else if(action === 'close'){

      modalTarget.current.close()

    }
  }