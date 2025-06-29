function Home() {
  return (
    <div className="flex gap-4 w-screen h-screen p-16 bg-gradient-to-br from-[#0f0f1b] to-[#1a1a2e] text-white font-sans">
      {/* Left */}
      <div className="flex flex-col gap-4 w-[30%]">
        <div className="hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] transition cursor-pointer
         h-[40%] bg-white/10 backdrop-blur-md border border-white/10 rounded-3xl p-4 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
          Top Left
        </div>
        <div className=" hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] transition cursor-pointer
         h-[60%] bg-white/10 backdrop-blur-md border border-white/10 rounded-3xl p-4 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
          Bottom Left
        </div>
      </div>
 
      {/* Right */}
      <div className="flex flex-col gap-4 w-[70%]">
        <div className=" hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] transition cursor-pointer
         h-[70%] bg-white/10 backdrop-blur-md border border-white/10 rounded-3xl p-4 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
          Top Right
        </div>
        <div className="grid grid-cols-2 gap-4 h-[30%]">
          <div className="hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] transition cursor-pointer 
          bg-white/10 backdrop-blur-md border border-white/10 rounded-3xl p-4 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
            Bottom Right Left
          </div>
          <div className="hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] transition cursor-pointer
           bg-white/10 backdrop-blur-md border border-white/10 rounded-3xl p-4 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
            Bottom Right Right
          </div>
        </div>
      </div>
    </div>
  );
}
export default Home;

/** 
 * Add hover effects: glow on hover

Add subtle gradient borders

Add a space/star field background image

Use Framer Motion for animated bubble entry
*/
