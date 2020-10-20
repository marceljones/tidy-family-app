import React, { useContext, useState, useEffect } from "react"
import { FamMemberContext } from "../famMembers/FamMemberProvider"
import { useHistory, useParams } from 'react-router-dom';

export const FamMemberForm = () => {
    const { addFamMember, getFamMemberById, updateFamMember } = useContext(FamMemberContext)


    //for edit, hold on to state of fam member in this view
    const [famMember, setFamMembers] = useState({})
    //wait for data before button is active
    const [isLoading, setIsLoading] = useState(true);

    const { famMemberId } = useParams();
    const history = useHistory();

    //when field changes, update state. This causes a re-render and updates the view.
    //Controlled component
    const handleControlledInputChange = (event) => {
        //When changing a state object or array, 
        //always create a copy make changes, and then set state.
        const newFamMember = { ...famMember }
        //animal is an object with properties. 
        //set the property to the new value
        newFamMember[event.target.name] = event.target.value
        //update state
        setFamMembers(newFamMember)
    }

    // If famMemberId is in the URL, getFamMemberById
    useEffect(() => {

        if (famMemberId) {
            getFamMemberById(famMemberId)
                .then(famMember => {
                    setFamMembers(famMember)
                    setIsLoading(false)
                })
        } else {
            setIsLoading(false)
        }

    }, [])

    const constructFamMemberObject = () => {
        if (parseInt(famMember.profilePicId) === 0) {
            window.alert("Please select a profile picture!")
        } else {
            //disable the button - no extra clicks
            setIsLoading(true);
            if (famMemberId) {
                //PUT - update
                updateFamMember({
                    id: famMember.id,
                    name: famMember.name,
                    profilePicId: parseInt(famMember.profilePicId)
                })
                    .then(() => history.push(`/famMembers/detail/${famMember.id}`))
            } else {
                //POST - add
                addFamMember({
                    name: famMember.name,
                    profilePicId: parseInt(famMember.profilePicId)
                })
                    .then(() => history.push("/"))
            }
        }
    }

    return (
        <form className="famMemberForm">
            <h2 className="famMemberForm__title">New Family Member</h2>
            <fieldset>
                <div className="form-group">
                    <label htmlFor="famMemberName">Family member name: </label>
                    <input type="text" id="famMemberName" name="name" required autoFocus className="form-control"
                        placeholder="Family member name"
                        onChange={handleControlledInputChange}
                        defaultValue={famMember.name} />
                </div>
            </fieldset>

            <button className="btn btn-primary"
                disabled={isLoading}
                onClick={event => {
                    event.preventDefault() // Prevent browser from submitting the form
                    constructFamMemberObject()
                }}>
                {famMemberId ? <>Save Family Member</> : <>Add Family Member</>}</button>
        </form>
    )
}