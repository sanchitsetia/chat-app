import React, { useEffect, useRef } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import useSocket from "../Hooks/useSocket";
import useStore from "../zustand/useStore";
import { useNavigate } from "react-router-dom";

type Inputs = {
  username: string;
};

const CreateRoom = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const setRoomId = useStore((state) => state.setRoomId);
  const navigate = useNavigate();

  const { ws } = useSocket();
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    ws.send(JSON.stringify({ type: "create", payload: data }));
    console.log(data);
  };

  useEffect(() => {
    if (!ws) return;
    ws.onmessage = (event: MessageEvent) => {
      const parsedMessage = JSON.parse(event.data);
      if (parsedMessage.type === "created") {
        setRoomId(parsedMessage.roomId);
        navigate(`/room`);
      }
    };
  }, [ws]);

  return (
    <div className="w-full h-full">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full h-full flex justify-center items-center"
      >
        <div className=" p-6 flex flex-col gap-8 bg-slate-500 rounded-xl">
          <div className="text-2xl">Create a chat room!!</div>
          <input
            {...register("username", { required: true })}
            className="rounded-lg p-2 text-black"
            placeholder="Enter username"
          />
          <button type="submit" className="bg-blue-500 rounded-lg p-2">
            Create Room
          </button>
          {errors.username && <span>This field is required</span>}
        </div>
      </form>
    </div>
  );
};

export default CreateRoom;
