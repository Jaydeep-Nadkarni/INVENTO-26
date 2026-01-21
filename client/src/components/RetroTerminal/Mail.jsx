import React, { useState } from 'react';

const Mail = () => {
  const [selectedMail, setSelectedMail] = useState(null);

  const messages = [
    {
      id: 1,
      from: 'Jaydeep',
      subject: 'Mission Accomplished!',
      date:new Date().toLocaleDateString('en-IN', { year: 'numeric', month: '2-digit', day: '2-digit' }),
      body: `Hello everyone!
      
      If you are reading this, then the mission is already accomplished.I am glad that you have stayed up till here. To be honest, putting a simulated OS inside a fest website didn’t seem like the most obvious or practical idea, maybe even a little over the top.

      But sometimes creativity isn’t about what makes sense it’s about doing something no one expects.

      So this became more than just a website. It became an experience. Something different. Something people would remember, even if they didn’t fully understand it at first.

      Kudos to all the technical team for their hard work and dedication. Building something with just a team of 3 people is a unique experience.
      
      Hope to see you all at INVENTO 2026
      
      -Jaydeep
      Frontend Developer`
    },
    {
      id: 2,
      from: 'Agent X',
      subject: 'New Mission',
      date: '30 Jan',
      body: `Agent Z, We have a new mission for your. Show your participation and entusiasm in the INVENTO 2026, remember we need to conquer the world. 
      
      Good luck!`
    },
    {
      id: 3,
      from: 'Intelligence',
      subject: 'Mission Update',
      date: '03 Jan',
      body: 'I want you to give me all the mission updates. We are on track it. Keep up the good work!'
    }
  ];

  return (
    <div className="flex h-full bg-[#c0c0c0]">
      
      {/* Inbox List */}
      <div className="w-1/3 border-r border-gray-400 bg-white win95-border-inset m-1 overflow-y-auto">
        {messages.map(msg => (
          <div
            key={msg.id}
            onClick={() => setSelectedMail(msg)}
            className={`p-2 border-b border-gray-200 cursor-pointer hover:bg-blue-100 
              ${selectedMail?.id === msg.id ? 'bg-blue-800 text-white' : ''}`}
          >
            <div className="text-[10px] font-bold truncate">{msg.from}</div>
            <div className="text-[9px] truncate">{msg.subject}</div>
          </div>
        ))}
      </div>

      {/* Message View */}
      <div className="flex-1 bg-white win95-border-inset m-1 p-3 overflow-y-auto">
        {selectedMail ? (
          <div className="text-[11px] font-sans">
            
            {/* Header */}
            <div className="border-b border-gray-200 pb-2 mb-2">
              <div className="font-bold">
                From: <span className="font-normal">{selectedMail.from}</span>
              </div>
              <div className="font-bold">
                Subject: <span className="font-normal">{selectedMail.subject}</span>
              </div>
              <div className="font-bold">
                Date: <span className="font-normal">{selectedMail.date}</span>
              </div>
            </div>

            {/* Body */}
            <div className="leading-relaxed whitespace-pre-line">
              {selectedMail.body}
            </div>

          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400 text-[10px] flex-col gap-2">
            <div className="text-3xl font-bold opacity-20">MAIL</div>
            Select a message to read
          </div>
        )}
      </div>
    </div>
  );
};

export default Mail;
