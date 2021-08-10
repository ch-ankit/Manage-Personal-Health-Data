import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    value: JSON.parse(window.localStorage.getItem('user')),
    doctor: JSON.parse(window.localStorage.getItem('doctor')),
    darkMode: false,
    documentName: JSON.parse(window.localStorage.getItem('documentName')),
    report: JSON.parse(window.localStorage.getItem('report')),
    shareDocuments: window.localStorage.getItem('shareDocuments') === "" || window.localStorage.getItem('shareDocuments') === null ? [] : JSON.parse(window.localStorage.getItem('shareDocuments')),
    recentPatient: JSON.parse(window.localStorage.getItem('recentPatient')),
    patientDataForNotification: JSON.parse(window.localStorage.getItem('patientDataForNotification')),
    dummy: JSON.parse(window.localStorage.getItem('dummy')) ?? false

  },
  reducers: {
    loginUser: (state, action) => {
      state.value = action.payload;
      const data = JSON.stringify(action.payload);
      window.localStorage.setItem('user', data);

    },
    loginDoc: (state, action) => {
      state.doctor = action.payload;
      const data = JSON.stringify(action.payload);
      window.localStorage.setItem('doctor', data);

    },
    logoutUser: (state) => {
      state.value = null;
      window.localStorage.setItem('user', null);
    },
    logoutDoctor: (state) => {
      state.doctor = null;
      state.recentPatient=null;
      window.localStorage.setItem("recentPatient", null);
      window.localStorage.setItem('doctor', null);
    },
    darkmode: (state) => {
      state.darkMode = !state.darkMode;
      const data = JSON.stringify(state.darkMode);
      window.localStorage.setItem('darkMode', data);
    },
    documentGet: (state, action) => {
      state.documentName = action.payload;
      const data = JSON.stringify(action.payload);
      window.localStorage.setItem('documentName', data);
    },
    reportGet: (state, action) => {
      state.report = action.payload;
      const data = JSON.stringify(action.payload);
      window.localStorage.setItem('report', data);
    },
    shareDocs: (state, action) => {
      console.log(state.shareDocuments)
      console.log([...state.shareDocuments, action.payload])
      let tempdata=state.shareDocuments;
      tempdata=tempdata.concat(action.payload)
      state.shareDocuments = tempdata;
      const data = JSON.stringify(tempdata);
      window.localStorage.setItem('shareDocuments', data);
    },
    deleteShareDocs: (state, action) => {
      let data = state.shareDocuments;
      data.pop(action.payload);
      state.shareDocuments = data;
      const data1 = JSON.stringify(data);
      window.localStorage.setItem('shareDocuments', data1);
    },
    removeShareDocs: (state) => {
      state.shareDocuments = [];
      window.localStorage.setItem('shareDocuments', []);
    },
    recentPatients: (state, action) => {
      state.recentPatient = action.payload;
      const data = JSON.stringify(action.payload);
      window.localStorage.setItem("recentPatient", data);
    },
    patientDataDoctorNotification: (state, action) => {
      state.patientDataForNotification = action.payload
      const data = JSON.stringify(action.payload);
      window.localStorage.setItem("patientDataForNotification", data);
    },
    setDummy:(state)=>{
      state.dummy=!state.dummy;
      const data = JSON.stringify(!state.dummy);
      window.localStorage.setItem("dummy", data);
    }
  },
});

export const { loginDoc, loginUser, logoutDoctor, logoutUser, darkmode, documentGet, reportGet, shareDocs, removeShareDocs, deleteShareDocs, recentPatients, patientDataDoctorNotification ,setDummy} = userSlice.actions;
export const userEmail = (state) => state.user.value
export default userSlice.reducer;
