import React from "react";
import { BackendApi } from "../../api/backend";
import { useEffect } from "react";

const Logout = () => {
  async function handleLogout() {
    try {
      await BackendApi.get("/api/user/logout");
      alert("logout success");
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    handleLogout();
  }, []);

  return <div>temporary logout page</div>;
};

export default Logout;
