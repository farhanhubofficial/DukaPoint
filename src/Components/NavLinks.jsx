import React , {useState}from "react";
import { Link } from "react-router-dom";

function NavLinks() {
     
  const [HrMenu, setHrMenu] = useState("");
  const [About, SetAbout] = useState(false);
  function handleHomeHr() {
    setHrMenu("Home");
  }
  function handleAboutHr() {
    setHrMenu("About");
  }
  function handleCARPETSHr() {
    setHrMenu("Carpets");
  }
  function handleCurtainsHr() {
    setHrMenu("Curtains");
  }
  function handleDUVETSHr() {
    setHrMenu("Duvets");
  }
  function handleSHEARSHr() {
    setHrMenu("Shears");
  }
  function handlePILLOWSHr() {
    setHrMenu("Pillows");
  }
  // function MouseOveer(){
  //   console.log('hey')
  // }
  function MouseMoeve() {
    SetAbout(true);
  }
  function MouseLeave() {
    SetAbout(false);
  }


  return <>
  <div className=" hidden lg:block font-bold text-yellow-800/100">
 <nav className=" flex justify-between items-center      text-lg gap-6 text-yellow-900   px-">
        <Link to="/" onClick={handleHomeHr}>
          HOME{" "}
          <hr
            className={
              HrMenu === "Home" ? "border-none w-[80%] h-[3px] bg-black" : ""
            }
          />{" "}
        </Link>
        <div
          className=" "
          
        >
        <div className="relative" onMouseLeave={MouseLeave}
          onMouseMove={MouseMoeve}>
        <Link to="/About" onClick={handleAboutHr}>
            ABOUT US
            <hr
              className={
                HrMenu === "About" ? "border-none w-[80%] h-[3px] bg-black" : ""
              }

            />
          </Link>
          <div className={ About ?" bg-slate-100 shadow-custom-light border  h-80 w-[270%] left-[-3rem] absolute flex flex-col p-3": "hidden "}>
         <Link className=" border-b-2 border-solid border-yellow-800" to= '/Vision'> <h1 className="my-8">Vission, Mission And Core  <span className="">Values</span></h1></Link> 
      <Link className="border-b-2 border-solid border-yellow-800 " to= '/Approach'><h1 className="ml-[-7.5rem]  my-9">Our Approach</h1></Link>    
       <Link className="mt-5"><h1>Our  Product And Services</h1></Link>   
          
        

          </div>
        </div>
          
        </div>
        <Link to="/Curtains" onClick={handleCurtainsHr}>
          CURTAINS{" "}
          <hr
            className={
              HrMenu === "Curtains"
                ? "border-none w-[80%] h-[3px] bg-black"
                : ""
            }
          />
        </Link>
        <Link to="/Shears" onClick={handleSHEARSHr}>
          SHEARS
          <hr
            className={
              HrMenu === "Shears" ? "border-none w-[80%] h-[3px] bg-black" : ""
            }
          />
        </Link>
        <Link to="/Carpets" onClick={handleCARPETSHr}>
          CARPETS{" "}
          <hr
            className={
              HrMenu === "Carpets" ? "border-none w-[80%] h-[3px] bg-black" : ""
            }
          />
        </Link>
        <Link to="/Pillows" onClick={handlePILLOWSHr}>
          PILLOWS{" "}
          <hr
            className={
              HrMenu === "Pillows" ? "border-none w-[80%] h-[3px] bg-black" : ""
            }
          />
        </Link>
        <Link to="/Duvets" onClick={handleDUVETSHr}>
          DUVETS{" "}
          <hr
            className={
              HrMenu === "Duvets" ? "border-none w-[80%] h-[3px] bg-black" : ""
            }
          />
        </Link>
      </nav>

      </div>
   </>;
}

export default NavLinks;
