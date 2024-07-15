import React, { useState, useEffect } from 'react';

const Home: React.FC = () => {
  useEffect(() => {
    // window.location.reload(); // Reload the page after logout
   
  }, []);

 
 
  return (
    <div className="h-screen  items-center">
      <h2 className="text-white font-bold text-center ml-20 mt-20">Welcome !</h2>
    </div>
  );
}

export default Home;
