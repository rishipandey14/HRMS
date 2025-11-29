import { Bell, Search } from 'lucide-react';

const Navbar = () => {
  return (
    <header className="w-full bg-[#f0f0f0] px-6 py-3 flex items-center justify-between rounded-xl">
    

      {/* Middle: Search */}
      <div className="w-[24rem] h-10 bg-white rounded-full flex items-center px-4">
        <Search className="w-4 h-4 text-gray-400 mr-2" />
        <input
          type="text"
          placeholder="Search Task"
          className="flex-1 outline-none bg-transparent text-sm text-gray-600 placeholder-gray-400"
        />
      </div>

     

      {/* Right: Bell + Avatar */}
      <div className="flex items-center gap-6">
        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
          <Bell className="w-5 h-5 text-black" />
        </div>

        {/* Divider */}
        <div className="h-6 border-l border-gray-300" />

        {/* Avatar and name */}
        <div className="flex items-center gap-2">
          <img
            src="https://api.dicebear.com/7.x/thumbs/svg?seed=Tanmay"
            alt="Avatar"
            className="w-10 h-10 rounded-full border-2 border-white"
          />
          <div>
            <p className="text-sm font-medium text-black leading-4">Tanmay Pardhi</p>
            <p className="text-xs text-gray-400">User</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

 