import React, { createContext, useContext, useState, ReactNode } from "react";
interface Notif { id: string; title: string; desc: string; type: "info"|"danger"|"success"; time: string }
interface NotifCtx { notifications: Notif[]; add: (n:Omit<Notif,"id">)=>void; remove: (id:string)=>void }
const NotifContext = createContext<NotifCtx>({} as NotifCtx);
export const NotificationProvider: React.FC<{children:ReactNode}> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notif[]>([]);
  const add = (n: Omit<Notif,"id">) => setNotifications(prev => [{ ...n, id: Date.now().toString() }, ...prev]);
  const remove = (id: string) => setNotifications(prev => prev.filter(n => n.id !== id));
  return <NotifContext.Provider value={{ notifications, add, remove }}>{children}</NotifContext.Provider>;
};
export const useNotifications = () => useContext(NotifContext);
