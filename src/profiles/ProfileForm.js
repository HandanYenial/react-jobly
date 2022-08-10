import React from "react";
import { useState , useContext } from "react";
import JoblyApi from "../api/api";
import UserContext from "../auth/UserContext";
import Alert from "../common/Alert";

/**Profile editing form
 * 1. Display profile from,
 * 2. Update profile on submit
 * 4.Submitting the form calls the api to save the profile
 * 5. Routed at /profile
 * 
 */
function ProfileForm(){
    const { currentUser , setCurrentUser } = useContext(UserContext);
    const [formData , setFormData] = useState({
                                       firstName : currentUser.firstName,
                                       lastName  : currentUser.lastName,
                                       email     : currentUser.email,
                                       username  : currentUser.userName,
                                       password  : "",
    });
    const [formErrors , setFormErrors] = useState([]);

    //switch to use timed message
    const [saveConfirmed , setSaveConfirmed] = useState(false);

    console.debug(
                  "ProfileForm",
                  "currentUser=", currentUser,
                  "formData=" , formData,
                  "formErrors=" , formErrors,
                  "saveConfirmed=", saveConfirmed,
    );

     /** on form submit:
   * - attempt save to backend & report any errors
   * - if successful
   *   - clear previous error messages and password
   *   - show save-confirmed message
   *   - set current user info throughout the site
   */

    async function handleSubmit(evt){
        evt.preventDefault();

        let profileData = {
            firstName : formData.firstName,
            lastName  : formData.lastName,
            email     : formData.email,
            password  : formData.password,
        }

        let username = formData.username;
        let updatedUser;

        try{
            updatedUser = await JoblyApi.saveProfile(username , profileData);
        } catch (errors) {
            debugger;
            setFormErrors(errors);
            return;
        }

        setFormData(form => ({...form , password : ""}));
        setFormErrors([]);
        setSaveConfirmed(true);

        //update current user context
        setCurrentUser(updatedUser);
    }
    //Handle form data changes
    function handleChange(evt){
        const { name, value } = evt.target;
        setFormData(form => ({...form , [name] : value}));
        setFormErrors([]);
    }

    return(
        <div className="col-md-6 offset-md-3 col-lg-4 offset-lg-4">
            <h3>Profile</h3>
            <div className ="card">
                <div className = "card-body">
                    <form>
                        <div className = "form-group">
                            <label> Username </label>
                            <p className = "form-control-plaintext"> 
                             {formData.username}
                            </p>
                        </div>
                        <div className = "form-group">
                            <label>First Name</label>
                            <input
                                  name = "firstName"
                                  className = "form-control"
                                  value = {formData.firstName}
                                  onChange = {handleChange}
                            />
                        </div>

                        <div className ="form-group">
                            <label>Last Name</label>
                            <input
                                  name = "lastName"
                                  className = "form-control"
                                  value = {formData.lastName}
                                  onChange = {handleChange}
                            />
                        </div> 

                        <div className = "form-group">
                            <label>Email</label>
                            <input 
                                  name = "email"
                                  className = "form-control"
                                  value ={formData.value}
                                  onChange = {handleChange}
                            />
                        </div>  

                        <div className ="form-group">
                            <label>Confirm password to make changes: </label>
                            <input 
                                  name ="password"
                                  type = "password"
                                  className = "form-control"
                                  value = {formData.password}
                                  onChange = {handleChange}
                            />
                        </div> 

                        {formErrors.length
                              ? <Alert type="danger" messages={formErrors} />
                              : null
                        }
                        {saveConfirmed
                              ? <Alert type="success" messages = {["Updated successfully."]} />
                              : null
                        }
                        <button 
                                className = "btn btn-primary btn-block mt-4"
                                onClick = {handleSubmit}
                        >
                            Save Changes 
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ProfileForm;