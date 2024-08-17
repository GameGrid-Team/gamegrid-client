import Image from 'next/image'
const LoadingOverlay = () => {
  return (
    //   <div className="fixed inset-0 flex items-center bg-cover bg-main-background justify-center z-50">
    //     <div className="absolute inset-0 opacity-50 backdrop-blur-md"></div>
    //     <div className="relative ">
    //       <div
    //         className="w-24 h-24 bg-cover  bg-no-repeat"
    //         style={{ backgroundImage: "url('/loadinganimation.gif')" }}
    //       ></div>
    //     </div>
    //   </div>
    <div className=' flex-grow modal-middle align-middle justify-self-center ml-44'>
      <Image src="/loadinganimation.gif" alt="Loading..." width={100} height={100} />{' '}
    </div>
  )
}

export default LoadingOverlay
