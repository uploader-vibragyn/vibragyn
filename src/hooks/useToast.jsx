import { useState } from "react";
import Toast from "../components/toast/Toast";

export function useToast() {
  const [message, setMessage] = useState("");

  function showToast(msg) {
    setMessage(msg);
    setTimeout(() => setMessage(""), 2500); // some sozinho
  }

  const ToastComponent = <Toast message={message} />;

  return { showToast, ToastComponent };
}
