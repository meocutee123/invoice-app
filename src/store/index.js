import { createStore } from "vuex";
import db from "../firebase/firebaseinit";

export default createStore({
  state: {
    invoiceModal: null,
    modalActive: null,
    invoiceData: [],
    invoicesLoaded: null,
    currentInvoiceArray: null,
    editInvoice: null,
  },
  mutations: {
    TOGGLE_INVOICE(state) {
      state.invoiceModal = !state.invoiceModal;
    },
    TOGGLE_MODAL(state) {
      state.modalActive = !state.modalActive;
    },
    TOGGLE_EDIT_INVOICE(state) {
      state.editInvoice = !state.editInvoice;
      console.log(state.editInvoice);
    },
    SET_INVOICE(state, payload) {
      state.invoiceData.push(payload);
    },
    INVOICE_LOADED(state) {
      state.invoicesLoaded = true;
    },
    SET_CURRENT_INVOICE_ARRAY(state, { id }) {
      state.currentInvoiceArray = state.invoiceData.filter(
        (invoice) => invoice.invoiceId === id
      );
    },
    UPDATE_INVOICE(state, payload) {
      state.currentInvoiceArray = [payload];
    },
    DELETE_INVOICE(state, { id }) {
      state.currentInvoiceArray = [];
      const invoiceIndex = state.invoiceData.findIndex(
        (invoice) => invoice.invoiceId === id
      );
      state.invoiceData.splice(invoiceIndex, 1);
    },
  },
  actions: {
    async getInvoices({ commit, state }) {
      const dbRef = db.collection("invoices");
      await dbRef.get().then((docs) =>
        docs.forEach((doc) => {
          if (
            !state.invoiceData.some(
              (invoice) => invoice.invoiceId === doc.data().invoiceId
            )
          ) {
            const data = { docId: doc.id, ...doc.data() };
            commit("SET_INVOICE", data);
          }
        })
      );
      commit("INVOICE_LOADED");
    },
    async updateInvoiceStatus(_, { docId, type }) {
      const invoiceRef = db.collection("invoices").doc(docId);
      await invoiceRef.update(type);
    },
    async deleteInvoice({ commit }, { docId, id }) {
      const invoiceRef = db.collection("invoices").doc(docId);
      await invoiceRef.delete();
      commit("DELETE_INVOICE", id);
    },
  },
  modules: {},
});
