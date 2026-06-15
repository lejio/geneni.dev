import React from "react";

export default function SendEmail() {
  const handleClick = async () => {
    console.log("Sending email...");
    const response = await fetch("/api/sendEmail", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: "Gene Ni", email: "gene@example.com" }),
    });
    const data = await response.json();
    console.log(data.message);
  };

  return <button onClick={() => handleClick()}>Send Email</button>;
}
