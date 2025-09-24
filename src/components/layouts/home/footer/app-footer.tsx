import { SquareLibrary } from "lucide-react";
import React from "react";

function AppFooter() {
  return (
    <footer>
      <div className="container mx-auto px-4 py-10 max-w-4xl text-white">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div className="flex justify-center  sm:justify-start gap-2">
            <SquareLibrary />
            <span>Delobooks</span>
          </div>
          <p className="mt-4 text-center text-sm  lg:mt-0 lg:text-right">
            Copyright &copy; 2022. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default AppFooter;
