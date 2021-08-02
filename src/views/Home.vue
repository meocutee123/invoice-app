<template>
  <div class="home container">
    <div class="header flex">
      <div class="left flex flex-column">
        <h1>Invoices</h1>
        <span>There are {{ invoices.length }} total invoices</span>
      </div>
      <div class="right flex">
        <div @click="toggleFilter()" class="filter flex" ref="filter">
          <span ref="filterLabel"
            >Filter by status
            <span v-if="filterBy">: {{ filterBy }}</span></span
          >
          <img src="@/assets/icon-arrow-down.svg" alt="" />
          <ul v-show="filterMenu" class="filter-menu">
            <li @click="filterInvoice">Draft</li>
            <li @click="filterInvoice">Pending</li>
            <li @click="filterInvoice">Paid</li>
            <li @click="filterInvoice">Clear all</li>
          </ul>
        </div>
        <div @click="newInvoice()" class="button flex">
          <div class="inner-button flex">
            <img src="@/assets/icon-plus.svg" alt="" />
          </div>
          <span>New invoice</span>
        </div>
      </div>
    </div>
    <!-- Invoices -->
    <div v-if="invoices.length">
      <Invoice
        v-for="(invoice, index) in invoices"
        :key="index"
        :invoice="invoice"
      />
    </div>
    <div v-else class="empty flex flex-column">
      <img src="@/assets/illustration-empty.svg" alt="" />
      <h3>There is nothing here</h3>
      <p>
        Create a new invoice by clicking the New Invoice button and get started
      </p>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from "vuex";
import Invoice from "../components/invoice.vue";
export default {
  name: "Home",
  components: {
    Invoice,
  },
  data() {
    return {
      filterMenu: false,
      invoices: [],
      filterBy: null,
    };
  },
  created() {
    this.filterInvoice();
  },
  methods: {
    ...mapMutations(["TOGGLE_INVOICE", "FILTER"]),

    toggleFilter() {
      this.filterMenu = !this.filterMenu;
    },
    newInvoice() {
      this.TOGGLE_INVOICE();
    },
    filterInvoice(e = null) {
      const invoiceStatus = e?.target?.innerText;
      invoiceStatus !== "Clear all"
        ? (this.filterBy = invoiceStatus)
        : (this.filterBy = null);
      switch (invoiceStatus) {
        case "Draft":
          this.invoices = this.invoiceData.filter(
            (invoice) => invoice.invoiceDraft === true
          );
          break;
        case "Paid":
          this.invoices = this.invoiceData.filter(
            (invoice) => invoice.invoicePaid === true
          );
          break;
        case "Pending":
          this.invoices = this.invoiceData.filter(
            (invoice) => invoice.invoicePending === true
          );
          break;
        default:
          this.invoices = this.invoiceData;
      }
    },
  },
  computed: {
    ...mapState(["invoiceData"]),
  },
};
</script>
<style lang="scss" scoped>
.home {
  color: #fff;
  .header {
    margin-bottom: 65px;
    .left,
    .right {
      flex: 1;
    }
    .right {
      justify-content: flex-end;
      align-items: center;
      .button,
      .filter {
        align-items: center;
        span {
          font-size: 12px;
        }
      }
    }
    .filter {
      position: relative;
      margin-right: 40px;
      span,
      img {
        cursor: pointer;
      }
      img {
        margin-left: 12px;
        width: 9px;
        height: 5px;
      }
      .filter-menu {
        width: 120px;
        position: absolute;
        top: 25px;
        list-style: none;
        background-color: #1b2139;
        box-shadow: 0 4px 6px -1px rbga(0, 0, 0, 0.1), 0 2px, 4px -1px,
          rgba(0, 0, 0, 0.06);
        li {
          cursor: pointer;
          padding: 10px 20px;
          font-size: 12px;
          &:hover {
            color: #1e2139;
            background: #fff;
          }
        }
      }
    }
    .button {
      padding: 8px 10px;
      background-color: #7c5dfa;
      border-radius: 40px;
      .inner-button {
        margin-right: 8px;
        border-radius: 50%;
        padding: 8px;
        align-items: center;
        justify-content: center;
        background-color: #fff;
      }
      img {
        width: 10px;
        height: 10px;
      }
    }
  }
  .empty {
    margin-top: 16px;
    align-items: center;
    img {
      width: 240px;
      height: 200;
    }
    h3 {
      font-size: 20px;
      margin-top: 40px;
    }
    p {
      text-align: center;
      max-width: 224px;
      font-size: 12px;
      font-weight: 300;
      margin-top: 16px;
    }
  }
}
</style>
