import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "../Contexts/AuthContext";

// Import bubble components
import WeekBubble from "../Components/Bubbles/WeekBubble";
import MonthlyBubble from "../Components/Bubbles/Calendar/MonthlyBubble";
import TasksBubble from "../Components/Bubbles/TasksBubble";
import MessagesBubble from "../Components/Bubbles/MessagesBubble";
import BubbleBubble from "../Components/Bubbles/BubblesBubbles";

const moduleComponents = {
  week: <WeekBubble />,
  calendar: <MonthlyBubble />,
  tasks: <TasksBubble />,
  messages: <MessagesBubble />,
  bubble: <BubbleBubble />,
};

function Home() {
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = "/login"; // Redirect to login after logout
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <>
      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="fixed top-6 right-6 z-50 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full shadow-lg transition-all"
      >
        Logout
      </button>

      {/* Animated Modal */}
      <AnimatePresence>
        {activeModule && (
          <motion.div
            className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              layoutId={activeModule}
              className="relative w-[90vw] h-[90vh] bg-white/10 backdrop-blur-lg rounded-3xl p-6 text-white shadow-2xl overflow-auto"
            >
              <button
                onClick={() => setActiveModule(null)}
                className="absolute top-4 right-6 text-white text-xl"
              >
                ✖
              </button>
              {moduleComponents[activeModule]}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bubble Grid */}
      <div className="flex gap-4 w-screen h-screen p-16 text-white font-sans bg-[url('/space-bg.png')] bg-cover bg-center bg-no-repeat">

        {/* Left Side */}
        <div className="flex flex-col gap-4 w-[30%]">
          <motion.div
            layoutId="week"
            onClick={() => setActiveModule("week")}
            className="h-[40%] bg-white/5 backdrop-blur-lg rounded-3xl p-4 shadow-md cursor-pointer hover:bg-white/10"
          >
            Weekly View
          </motion.div>

          <motion.div
            layoutId="tasks"
            onClick={() => setActiveModule("tasks")}
            className="h-[60%] bg-white/5 backdrop-blur-lg rounded-3xl p-4 shadow-md cursor-pointer hover:bg-white/10"
          >
            Task Manager
          </motion.div>
        </div>

        {/* Right Side */}
        <div className="flex flex-col gap-4 w-[70%]">
          <motion.div
            layoutId="calendar"
            onClick={() => setActiveModule("calendar")}
            className="h-[70%] bg-white/5 backdrop-blur-lg rounded-3xl p-4 shadow-md hover:bg-white/10 cursor-pointer"
          >
            Big Panel
          </motion.div>

          <div className="grid grid-cols-2 gap-4 h-[30%]">
            <motion.div
              layoutId="messages"
              onClick={() => setActiveModule("messages")}
              className="bg-white/5 backdrop-blur-lg rounded-3xl p-4 shadow-md hover:bg-white/10 cursor-pointer"
            >
              Bottom Right Left
            </motion.div>

            <motion.div
              layoutId="bubble"
              onClick={() => setActiveModule("bubble")}
              className="bg-white/5 backdrop-blur-lg rounded-3xl p-4 shadow-md hover:bg-white/10 cursor-pointer"
            >
              Bottom Right Right
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
