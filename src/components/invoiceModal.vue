<template>
  <div
    @click.self="TOGGLE_MODAL"
    ref="invoiceWrap"
    class="invoice-wrap flex flex-column"
  >
    <form @submit.prevent="publishInvoice" class="invoice-content">
      <h1 v-if="!editInvoice">New invoice</h1>
      <h1 v-else>Edit invoice</h1>
      <div class="bill-from flex flex-column">
        <h4>Bill form</h4>
        <div class="input flex flex-column">
          <label for="billerSreetAddress">Street address</label>
          <input
            required
            type="text"
            name=""
            id="billerSreetAddress"
            v-model="invoice.billerSreetAddress"
          />
        </div>
        <div class="location-details flex">
          <div class="input flex flex-column">
            <label for="billerCity">City</label>
            <input
              required
              type="text"
              name=""
              id="billerCity"
              v-model="invoice.billerCity"
            />
          </div>
          <div class="input flex flex-column">
            <label for="billerZipCode">Zip code</label>
            <input
              required
              type="text"
              name=""
              id="billerZipCode"
              v-model="invoice.billerZipCode"
            />
          </div>
          <div class="input flex flex-column">
            <label for="billerCountry">Country</label>
            <input
              required
              type="text"
              name=""
              id="billerCountry"
              v-model="invoice.billerCountry"
            />
          </div>
        </div>
      </div>
      <!-- bill to -->
      <div class="bill-to flex flex-column">
        <h4>Bill to</h4>
        <div class="input flex flex-column">
          <label for="clientName">Client name</label>
          <input
            required
            type="text"
            name=""
            id="clientName"
            v-model="invoice.clientName"
          />
        </div>
        <div class="input flex flex-column">
          <label for="clientEmail">Client email</label>
          <input
            required
            type="text"
            name=""
            id="clientEmail"
            v-model="invoice.clientEmail"
          />
        </div>
        <div class="input flex flex-column">
          <label for="clientSreetAddress">Street address</label>
          <input
            required
            type="text"
            name=""
            id="clientSreetAddress"
            v-model="invoice.clientSreetAddress"
          />
        </div>
        <div class="location-details flex">
          <div class="input flex flex-column">
            <label for="clientCity">City</label>
            <input
              required
              type="text"
              name=""
              id="clientCity"
              v-model="invoice.clientCity"
            />
          </div>
          <div class="input flex flex-column">
            <label for="clientZipCode">Zip code</label>
            <input
              required
              type="text"
              name=""
              id="clientZipCode"
              v-model="invoice.clientZipCode"
            />
          </div>
          <div class="input flex flex-column">
            <label for="clientCountry">Country</label>
            <input
              required
              type="text"
              name=""
              id="clientCountry"
              v-model="invoice.clientCountry"
            />
          </div>
        </div>
      </div>
      <!-- Invoice work details -->
      <div class="invoice-work flex flex-column">
        <div class="payment flex">
          <div class="input flex flex-column">
            <label for="invoiceDate">Invoice date</label>
            <input
              disabled
              type="text"
              name=""
              id="invoiceDate"
              v-model="invoice.invoiceDate"
            />
          </div>
          <div class="input flex flex-column">
            <label for="paymentDueDate">Payment due</label>
            <input
              disabled
              type="text"
              name=""
              id="paymentDueDate"
              v-model="invoice.paymentDueDate"
            />
          </div>
        </div>
        <div class="input flex flex-column">
          <label for="paymentTerms">Payment terms</label>
          <select
            required
            name=""
            id="paymentTerms"
            v-model="invoice.paymentTerms"
          >
            <option value="30">Net 30 days</option>
            <option value="60">Net 60 days</option>
          </select>
        </div>
        <div class="input flex flex-column">
          <label for="productDescription">Product description</label>
          <input
            required
            type="text"
            name=""
            id="productDescription"
            v-model="invoice.productDescription"
          />
        </div>
        <div class="work-items">
          <h3>Item list</h3>
          <table class="item-list">
            <tr class="table-heading flex">
              <th class="item-name">Item name</th>
              <th class="qty">Qty</th>
              <th class="price">Price</th>
              <th class="total">Total</th>
            </tr>
            <tr
              class="table-items flex"
              v-for="(item, index) in invoice.invoiceItemList"
              :key="index"
            >
              <td class="item-name">
                <input type="text" v-model="item.itemName" />
              </td>
              <td class="qty"><input type="text" v-model="item.qty" /></td>
              <td class="price"><input type="text" v-model="item.price" /></td>
              <td class="total">${{ (item.total = item.qty * item.price) }}</td>
              <img
                src="@/assets/icon-delete.svg"
                alt=""
                @click="deleteInvoiceItem(item.id)"
              />
            </tr>
          </table>

          <div @click="addNewInvoiceItem" class="flex button">
            <img src="@/assets/icon-plus.svg" alt="" />
            Add new item
          </div>
        </div>
      </div>
      <!-- Save -->
      <div class="save flex">
        <div class="left">
          <button type="button" @click="closeInvoice" class="red">
            Cancel
          </button>
        </div>
        <div class="right flex">
          <button
            type="button"
            v-if="!editInvoice"
            @click.self="saveDraft"
            class="dark-purple"
          >
            Save draft
          </button>
          <button
            v-if="!editInvoice"
            @click.self="publishInvoice"
            class="purple"
          >
            Create invoice
          </button>
          <button type="submit" v-if="editInvoice" class="purple">
            Update invoice
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex";
import { uid } from "uid";
import db from "../firebase/firebaseinit.js";
export default {
  name: "invoiceModel",
  data() {
    return {
      dateOptions: { year: "numeric", month: "short", day: "numeric" },
      invoice: {
        billerSreetAddress: null,
        billerCity: null,
        billerZipCode: null,
        billerCountry: null,
        clientCountry: null,
        clientName: null,
        clientSreetAddress: null,
        clientEmail: null,
        clientCity: null,
        clientZipCode: null,
        invoiceDateUnix: null,
        invoiceDate: null,
        paymentTerms: null,
        paymentDueDateUnix: null,
        paymentDueDate: null,
        productDescription: null,
        invoicePending: null,
        invoiceDraft: null,
        invoiceItemList: [],
        invoiceTotal: 0,
        paid: null,
      },
    };
  },
  created() {
    //get invoice date
    if (!this.editInvoice) {
      this.invoice.invoiceDateUnix = Date.now();
      this.invoice.invoiceDate = new Date(
        this.invoice.invoiceDateUnix
      ).toLocaleDateString("en-us", this.dateOptions);
    } else {
      const invoice = JSON.parse(JSON.stringify(this.currentInvoiceArray[0]));
      this.invoice = invoice;
    }
  },
  methods: {
    ...mapMutations([
      "TOGGLE_INVOICE",
      "TOGGLE_MODAL",
      "TOGGLE_EDIT_INVOICE",
      "UPDATE_INVOICE",
    ]),
    ...mapActions(["getInvoices"]),
    closeInvoice() {
      this.TOGGLE_MODAL();
    },
    addNewInvoiceItem() {
      this.invoice.invoiceItemList.push({
        id: uid(),
        itemName: "",
        qty: "",
        price: 0,
        total: 0,
      });
    },
    deleteInvoiceItem(id) {
      this.invoice.invoiceItemList = this.invoice.invoiceItemList.filter(
        (item) => item.id !== id
      );
    },
    calInvoiceTotal() {
      const { invoiceItemList: itemList } = this.invoice;
      this.invoice.invoiceTotal = itemList.reduce(
        (acc, curr) => acc + curr.total,
        0
      );
    },
    publishInvoice() {
      this.invoice.invoicePending = true;
      this.uploadInvoice();
    },
    saveDraft() {
      this.invoice.invoiceDraft = true;
      this.uploadInvoice();
    },
    async uploadInvoice() {
      if (!this.invoice.invoiceItemList.length) {
        alert("Please ensure you filled out work items!");
        return;
      }
      this.calInvoiceTotal();
      this.editInvoice
        ? await this.updateInvoice()
        : await this.createInvoice();
      this.TOGGLE_INVOICE();
      this.getInvoices();
    },
    async updateInvoice() {
      const dataBase = db.collection("invoices").doc(this.invoice.docId);
      await dataBase.update(this.invoice);
      this.UPDATE_INVOICE(this.invoice);
      this.TOGGLE_EDIT_INVOICE();
    },
    async createInvoice() {
      const dataBase = db.collection("invoices").doc();
      await dataBase.set({
        invoiceId: uid(6),
        ...this.invoice,
        invoiceItemList: this.invoice.invoiceItemList.map((item) => item),
      });
    },
  },
  watch: {
    "invoice.paymentTerms": function() {
      const futureDate = new Date();
      this.invoice.paymentDueDateUnix = futureDate.setDate(
        futureDate.getDate() + parseInt(this.invoice.paymentTerms)
      );
      this.invoice.paymentDueDate = new Date(
        this.invoice.paymentDueDateUnix
      ).toLocaleDateString("en-us", this.dateOptions);
    },
  },
  computed: {
    ...mapState(["editInvoice", "currentInvoiceArray"]),
  },
};
</script>

<style lang="scss" scoped>
.invoice-wrap {
  position: fixed;
  top: 0px;
  left: 90px;
  width: 100%;
  height: 100vh;
  z-index: 98;
  overflow-y: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
  @media (max-width: 900px) {
    top: 90px;
    left: 0px;
  }
  .invoice-content {
    position: relative;
    padding: 56px;
    max-width: 700px;
    width: 100%;
    background-color: #141625;
    color: #fff;
    box-shadow: 0 4px 6px -1px rbga(0, 0, 0, 0.1), 0 2px, 4px -1px,
      rgba(0, 0, 0, 0.06);
    h1 {
      margin-bottom: 48px;
      color: #fff;
    }
    h3 {
      margin-bottom: 16px;
      font-size: 16px;
      color: #777f98;
    }
    h4 {
      color: #7c5dfa;
      font-size: 12px;
      margin-bottom: 42px;
    }

    .bill-to,
    .bill-from {
      margin-bottom: 48px;
      .location-details {
        gap: 16px;
        div {
          flex: 1;
        }
      }
    }

    .invoice-work {
      .payment {
        gap: 24px;

        div {
          flex: 1;
        }
      }
      .work-items {
        .item-list {
          width: 100%;
          .table-heading,
          .table-items {
            gap: 16px;
            font-size: 12px;
            .item-name {
              flex-basis: 50%;
            }
            .qty {
              flex-basis: 10%;
            }
            .price {
              flex-basis: 20%;
            }
            .total {
              flex-basis: 20%;
              align-self: center;
            }
          }
          .table-heading {
            margin-bottom: 16px;
            th {
              text-align: left;
            }
          }
          .table-items {
            position: relative;
            margin-bottom: 24px;
            img {
              position: absolute;
              top: 15px;
              right: 0;
              width: 12px;
              height: 16px;
            }
          }
        }
        .button {
          color: #fff;
          background-color: #252945;
          align-items: center;
          justify-content: center;
          width: 100%;
          img {
            margin-right: 4px;
          }
        }
      }
    }
    .save {
      margin-top: 60px;
      div {
        flex: 1;
      }
      .right {
        justify-content: flex-end;
      }
    }
  }
  .input {
    margin-bottom: 24px;
  }
  label {
    font-size: 12px;
    margin-bottom: 6px;
  }
  input,
  select {
    width: 100%;
    background: #1e2139;
    color: #fff;
    border-radius: 4px;
    padding: 12px 4px;
    border: none;
    &:focus {
      outline: none;
    }
  }
}
</style>
