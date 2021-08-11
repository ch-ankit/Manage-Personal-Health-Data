import React, { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./EmergencyContact.scss";
import { setDummy } from "./features/counterSlice";
function EmergencyContact() {
  const gender = useRef(null);
  const relationship = useRef(null);
  const lastName = useRef(null);
  const firstName = useRef(null);
  const middleName = useRef(null);
  const phoneNo = useRef(null);
  const city = useRef(null);
  const district = useRef(null);
  const state = useRef(null);
  const country = useRef(null);
  const streetName = useRef(null);
  const postalCode = useRef(null);
  const workplace = useRef(null);
  const userData = useSelector((state) => state.user.value);
  const dispatch = useDispatch();
  const uploadEmergencyContact = async (e) => {
    e.preventDefault();
    console.log(userData.uId);
    const response = await fetch("http://localhost:7000/signup/addcontact", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        relationship: relationship.current.value,
        lastName: lastName.current.value,
        firstName: firstName.current.value,
        middleName: middleName.current.value,
        phoneNo: phoneNo.current.value,
        city: city.current.value,
        district: district.current.value,
        state: state.current.value,
        country: country.current.value,
        streetName: streetName.current.value,
        postalCode: postalCode.current.value,
        gender: gender.current.value,
        workplace: workplace.current.value,
        id: userData.uId,
      }),
    });
    console.log(response);
    const data = await response.json();
    console.log(data);
    dispatch(setDummy());
    alert("Added Emergency Contact");
  };
  return (
    <div className="emergencyContact">
      <h2>Emergency Contact</h2>
      <form onSubmit={uploadEmergencyContact}>
        <input ref={relationship} type="text" placeholder="Relationship" />
        <div className="emergencyContact__fullName">
          <input ref={firstName} type="text" placeholder="First Name" />
          <input ref={middleName} type="text" placeholder="Middle Name" />
          <input ref={lastName} type="text" placeholder="Last Name" />
        </div>
        <input
          ref={phoneNo}
          type="text"
          pattern="[+]{1}[0-9]{13}"
          placeholder="Phone no"
        />
        <div className="emergencyContact__Address">
          <input ref={city} type="text" placeholder="City" />
          <input ref={district} type="text" placeholder="District" />
          <input ref={state} type="text" placeholder="state" />
          <input ref={country} type="text" placeholder="Country" />
          <input ref={streetName} type="text" placeholder="Street Name" />
          <input ref={postalCode} type="text" placeholder="Postal COde" />
        </div>
        <div className="emergencyContact__gender">
          <select
            ref={gender}
            defaultChecked="Select Gender"
            id="gender"
            required
          >
            <option value="Select Gender" hidden>
              {" "}
              Select Gender
            </option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="emergencyContact__workPlace">
          <input ref={workplace} type="text" placeholder="Workplace" />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default EmergencyContact;
