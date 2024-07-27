import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Box, Avatar, Typography, Button, IconButton } from "@mui/material";
import { IoMdSend, IoMdArrowDown } from "react-icons/io";
import red from "@mui/material/colors/red";
import { useAuth } from "../context/AuthContext";
import ChatItem from "../components/chat/ChatItem";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from 'react-responsive';
import "./style.css";
import {
  deleteUserChats,
  getUserChats,
  sendChatRequest,
} from "../helpers/api-communicator";
import toast from "react-hot-toast";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const Chat = () => {
  const isSmallScreen = useMediaQuery({ query: '(max-width: 600px)' });
  const navigate = useNavigate();
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const chatBoxRef = useRef<HTMLDivElement | null>(null);
  const auth = useAuth();
  const [chatMessages, setChatMessages] = useState<Message[]>([]);

  const handleSubmit = async () => {
    const content = inputRef.current?.value.trim() || "";
    if (!content) return;

    if (inputRef.current) {
      inputRef.current.value = "";
    }

    const newMessage: Message = { role: "user", content };
    setChatMessages((prev) => [...prev, newMessage]);

    try {
      await sendChatRequest(content);
      // Fetch updated chats
      const updatedChats = await getUserChats();
      if (Array.isArray(updatedChats.chats)) {
        setChatMessages([...updatedChats.chats]);
      } else {
        console.error('updatedChats.chats is not an array:', updatedChats.chats);
        toast.error('Failed to load chats');
      }
    } catch (error) {
      console.error('Error sending chat request:', error);
      toast.error('Failed to send message');
    }
  };

  const handleDeleteChats = async () => {
    try {
      toast.loading("Deleting Chats", { id: "deletechats" });
      await deleteUserChats();
      setChatMessages([]);
      toast.success("Deleted Chats Successfully", { id: "deletechats" });
    } catch (error) {
      console.log(error);
      toast.error("Deleting chats failed", { id: "deletechats" });
    }
  };

  const handleScrollToBottom = () => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight - 1; // Adjust scroll position to be slightly up from the bottom
    }
  };

  useLayoutEffect(() => {
    if (auth?.isLoggedIn && auth.user) {
      toast.loading("Loading Chats", { id: "loadchats" });
      getUserChats()
        .then((data) => {
          if (Array.isArray(data.chats)) {
            setChatMessages([...data.chats]);
            toast.success("Successfully loaded chats", { id: "loadchats" });
            handleScrollToBottom();
          } else {
            console.error('data.chats is not an array:', data.chats);
            toast.error('Failed to load chats');
          }
        })
        .catch((err) => {
          console.log(err);
          toast.error("Loading Failed", { id: "loadchats" });
        });
    }
  }, [auth]);

  useEffect(() => {
    if (!auth?.user) {
      navigate("/login");
    }
  }, [auth, navigate]);

  useEffect(() => {
    handleScrollToBottom();
  }, [chatMessages]);

  const userName = auth?.user?.name;
  const userInitials = userName
    ? userName.split(" ").map(name => name[0]).join("")
    : "";

  return (
    <Box
      sx={{
        display: "flex",
        flex: 1,
        width: "100%",
        height: "100%",
        mt: 3,
        gap: 3,
        flexDirection: { xs: "column", md: "row" },
      }}
    >
      <Box
        sx={{
          display: { md: "flex", xs: "none" },
          flex: 0.2,
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            display: "flex",
            width: "100%",
            height: "60vh",
            bgcolor: "rgb(17,29,39)",
            borderRadius: 5,
            flexDirection: "column",
            mx: 3,
          }}
        >
          <Avatar
            sx={{
              mx: "auto",
              my: 2,
              bgcolor: "white",
              color: "black",
              fontWeight: 700,
            }}
          >
            {userInitials || "N/A"}
          </Avatar>
          <Typography sx={{ mx: "auto", fontFamily: "work sans" }}>
            You are talking to a ChatBOT
          </Typography>
          <Typography sx={{ mx: "auto", fontFamily: "work sans", my: 4, p: 3 }}>
            You can ask some questions related to Knowledge, Business, Advices,
            Education, etc. But avoid sharing personal information
          </Typography>
          <Button
            onClick={handleDeleteChats}
            sx={{
              width: "200px",
              my: "auto",
              color: "white",
              fontWeight: "700",
              borderRadius: 3,
              mx: "auto",
              bgcolor: red[300],
              ":hover": {
                bgcolor: red.A400,
              },
            }}
          >
            Clear Conversation
          </Button>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          flex: { md: 0.8, xs: 1 },
          flexDirection: "column",
          px: 3,
          position: "relative",
        }}
      >
        <Typography
          sx={{
            fontSize: { xs: "20px", md: "40px" },
            color: "white",
            mb: 2,
            mx: "auto",
            fontWeight: "600",
          }}
        >
          Model - GPT 3.5 Turbo
        </Typography>
        <Box
          ref={chatBoxRef}
          sx={{
            width: "100%",
            height: "60vh",
            borderRadius: 3,
            mx: "auto",
            display: "flex",
            flexDirection: "column",
            overflowY: "auto",
            overflowX: "hidden",
            scrollBehavior: "smooth",
          }}
        >
          {chatMessages.map((chat, index) => (
            <ChatItem content={chat.content} role={chat.role} key={index} />
          ))}
        </Box>
        <Box
          sx={{
            width: "100%",
            borderRadius: 8,
            backgroundColor: "rgb(17,27,39)",
            display: "flex",
            margin: "auto",
            marginBottom: "20px",
            position: "relative",
          }}
        >
          <textarea
            ref={inputRef}
            rows={2}
            style={{
              width: "100%",
              backgroundColor: "transparent",
              padding: "10px",
              border: "none",
              outline: "none",
              color: "white",
              fontSize: "16px",
              resize: "none",
              overflowY: "auto",
              boxSizing: "border-box",
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
          />
          <IconButton onClick={handleSubmit} sx={{ color: "white", mx: 1 }}>
            <IoMdSend />
          </IconButton>
        </Box>
        <IconButton
          onClick={handleScrollToBottom}
          sx={{
            position: "absolute",
            bottom: { xs: "70px", md: "20px", lg: "80px" },
            right: { xs: "10px", md: "50px" },
            backgroundColor: "aqua",
            color: "black",
            ":hover": {
              backgroundColor: "rgba(0, 255, 255, 0.8)",
            },
          }}
        >
          <IoMdArrowDown className={isSmallScreen ? 'arrow-icon-sm' : ''} />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Chat;
