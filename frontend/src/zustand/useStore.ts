import {create} from "zustand";

const useStore = create((set) => ({
    roomId: "",
    setRoomId: (roomId:string) => set({ roomId }),
  }));

  export default useStore