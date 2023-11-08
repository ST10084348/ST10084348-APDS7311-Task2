import React, { useState } from "react";
import { useNavigate } from "react-router";
export default function Register() {
 const [form, setForm] = useState({
   name: "",
   password: "",
 });
 const navigate = useNavigate();
  // These methods will update the state properties.
 function updateForm(value) {
   return setForm((prev) => {
     return { ...prev, ...value };
   });
 }

  // Input Validation
  function validateForm() {
    return (
      form.name.trim() !== "" &&
      form.password.trim() !== "" 
    );
  }

  // Password Obscuring
  function handlePasswordChange(e) {
    const newPassword = e.target.value;
    updateForm({ password: newPassword });
  }

 
  // Sanitize Data
  function sanitizeData(data) {
    return data.trim();
  }


// This function will handle the submission.
async function onSubmit(e) {
    e.preventDefault();
  
    if (!validateForm()) {
      window.alert("Please fill in all fields and ensure passwords match.");
      return;
    }
    
    const sanitizedForm = {
      name: sanitizeData(form.name),
      password: sanitizeData(form.password),
    };


    // When a post request is sent to the create url, we'll add a new record to the database.
    const newPerson = { ...form };
  
    await fetch("http://localhost:5050/user/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newPerson),
    })
    .catch(error => {
      window.alert(error);
      return;
    });
  
    setForm({ name: "", password: ""});
    navigate("/");
}
  // This following section will display the form that takes the input from the user.
 return (
   <div>
     <h3 style={{color: 'navy'}}><b>Register</b></h3>
     <form onSubmit={onSubmit}>
       <div className="form-group">
         <label htmlFor="name">Name</label>
         <input
           type="text"
           className="form-control"
           id="name"
           value={form.name}
           onChange={(e) => updateForm({ name: e.target.value })}
         />
       </div>
       <div className="form-group">
         <label htmlFor="password">Password</label>
         <input
           type="text"
           className="form-control"
           id="password"
           value={form.position}
           onChange={(e) => updateForm({ position: e.target.value })}
         />
       </div>
   
    
       <div className="form-group">
         <input
           type="submit"
           value="Register"
           className="btn btn-primary"
         />
       </div>
     </form>
   </div>
 );
}