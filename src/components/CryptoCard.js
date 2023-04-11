
const CryptoCard = ({ walletAddress }) => {
    return ( 
        <div className="flex justify-center items-center w-80 h-48vh mx-auto bg-gradient-to-r from-blue-500 to-indigo-800 rounded-lg shadow-lg hover:scale-105 ease-in-out duration-300">
            <div className="relative flex flex-col w-90 h-90%  rounded-md p-6">
                <div className="flex justify-between items-center">
                    <img src="./BenqiLogoWhiteMono.png" alt="logo" className="w-18 h-10" />
                </div>

                <div className="flex justify-between items-center mt-8">
                    <p className="text-sm font-medium tracking-wide leading-snug uppercase">Connected to</p>
                </div>
            
            <p className="text-xs font-medium tracking-wider leading-snug mt-6">{walletAddress}</p>
            </div>
       </div>
    )
}

export default CryptoCard