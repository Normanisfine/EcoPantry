import React, { useState } from "react";
import Card from "../../components/card/Card";
import "./AIChat.scss";
import { toast } from "react-toastify";
import axios from "axios";
import Loader from "../../components/loader/Loader";


const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const API_URL = `${BACKEND_URL}/api/aichat`;

const AIChat = () => {

    const [message, setMessage] = useState('');
    const [response, setResponse] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleMessageChange = (event) => {
        setMessage(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        // if (!message.trim()) {
        //     toast.error("Please enter a message.");
        //     return;
        // }

        try {
            toast.success("Message sent, please wait...")
            const { data } = await axios.post(API_URL, {message});
            setResponse(data.message);
            setMessage('');  // Clear the input after sending
        } catch (error) {
            console.error("Error sending message to AI", error);
            toast.error("Failed to send message.");
        } finally {
          setIsLoading(false);
        }
    };

    return (
      <div className="contact">
          <h3 className="--mt">AI Chat</h3>
          <div className="section">
              <form onSubmit={handleSubmit}>
                  <Card cardClass="card">
                      <label>Message</label>
                      <textarea
                          cols="30"
                          rows="10"
                          name="message"
                          value={message}
                          onChange={handleMessageChange}
                          placeholder="Please type in your request. Default request: provide a food plan using your bio and food inventory information."
                      ></textarea>
                      <button type="submit" className="--btn --btn-primary">CHAT</button>
                  </Card>
              </form>
              {isLoading && <Loader />} 
              <div className="details">
                <Card cardClass={"card"}>
                  <p>{response || "Your personalized response will appear here!"}</p>
                  </Card>

                  <Card cardClass={"card2"}>
                      <h3>Chat With Advanced AI Helper</h3>
                      <p>Powered by Microsoft Azure ©</p>
                      
                      <p>We will utilize your food inventory and bio information to give you a personalized food plan.</p>
                  </Card>
                  
              </div>
          </div>
      </div>
      );
    }




export default AIChat;
