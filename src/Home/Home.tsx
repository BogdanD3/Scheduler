import { useState } from "react";
import Modal from "../Components/Modal";

function Home() {
  const [activeModule, setActiveModule] = useState<string | null>(null);

  return (
    <>
      <Modal isOpen={!!activeModule} onClose={() => setActiveModule(null)}>

        {activeModule === "week" && (
          <div>
            <h2 className="text-2xl mb-4">✅ Tasks</h2>
            <p>[Tasks module placeholder]</p>
          </div>
        )}

        {activeModule === "tasks" && (
          <div>
            <h2 className="text-2xl mb-4">✅ Tasks</h2>
            <p>[Tasks module placeholder]</p>
          </div>
        )}

        {activeModule === "calendar" && (
          <div>
            <h2 className="text-2xl mb-4">📅 Monthly Calendar</h2>
            <div className="w-full h-full border border-white/30 rounded-xl p-4">
              [Calendar Component Goes Here]
            </div>
          </div>
        )}


        {activeModule === "messages" && (
          <div>
            <h2 className="text-2xl mb-4">✅ Tasks</h2>
            <p>[Tasks module placeholder]</p>
          </div>
        )}

        {activeModule === "bubble" && (
          <div>
            <h2 className="text-2xl mb-4">✅ Tasks</h2>
            <p>[Tasks module placeholder]</p>
          </div>
        )}

      </Modal>

      <div className="flex gap-4 w-screen h-screen p-16 text-white font-sans bg-[url('/space-bg.png')] bg-cover bg-center bg-no-repeat">

        {/* Left Side */}
        <div className="flex flex-col gap-4 w-[30%]">
          <div
            onClick={() => setActiveModule("week")}
            className="h-[40%] bg-white/5 backdrop-blur-lg rounded-3xl p-4 shadow-md cursor-pointer hover:bg-white/10 transition"
          >
            Monthly Calendar
          </div>
          <div
            onClick={() => setActiveModule("tasks")}
            className="h-[60%] bg-white/5 backdrop-blur-lg rounded-3xl p-4 shadow-md cursor-pointer hover:bg-white/10 transition"
          >
            Task Manager
          </div>
        </div>

        {/* Right Side */}
        <div className="flex flex-col gap-4 w-[70%]">
          <div 
          onClick={() => setActiveModule("calendar")}
          className="h-[70%] bg-white/5 backdrop-blur-lg rounded-3xl p-4 shadow-md cursor-pointer">
            Big Panel
          </div>
          <div className="grid grid-cols-2 gap-4 h-[30%]">
            <div 
            onClick={() => setActiveModule("messages")}
            className="bg-white/5 backdrop-blur-lg rounded-3xl p-4 shadow-md cursor-pointer">
              Bottom Right Left
            </div>
            <div 
            onClick={() => setActiveModule("bubble")}
            className="bg-white/5 backdrop-blur-lg rounded-3xl p-4 shadow-md cursor-pointer">
              Bottom Right Right
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;

/** 
 * Add hover effects: glow on hover

Add subtle gradient borders

Add a space/star field background image

Use Framer Motion for animated bubble entry
*/
