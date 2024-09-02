<template>
  <div>
    <v-list>
      <v-list-item class="px-2">
        <v-layout>
          <v-spacer />
          <nuxt-link to="/dashboard">
            <v-list-item-avatar size="64">
              <v-img v-if="this.$auth.user.avatar" :src="this.$auth.user.avatar"></v-img>
              <v-img v-else src="/avatar.png"></v-img>
            </v-list-item-avatar>
          </nuxt-link>
          <v-spacer />
        </v-layout>
      </v-list-item>
      <v-list-item link>
        <v-list-item-content>
          <v-list-item-title class="text-h6 text-center">
            {{ this.$auth.user.full_name }}
          </v-list-item-title>
          <v-list-item-subtitle class="text-center">
            {{ this.$auth.user.email }}
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <v-divider></v-divider>

    <div class="my-4 mx-4">
      <v-btn nuxt to="/stages" small block color="primary" class="text-capitalize">
        {{ this.$t("sidebar.see_all_stages") }}
      </v-btn>
    </div>

    <v-divider></v-divider>
    <v-container>
      <v-treeview :items="treeItems" activatable open-on-click item-key="id" item-text="title" item-children="children">
        <template v-slot:prepend="{ item, open }">
          <v-icon v-if="item.children && item.children.length">
            {{ open ? 'mdi-folder-open' : 'mdi-folder' }}
          </v-icon>
          <v-icon v-else>
            mdi-file-document
          </v-icon>
        </template>
      </v-treeview>
    </v-container>
    <!-- 
    <v-treeview :items="renamedPortfolios" item-key="name" open-on-click>
      <template v-slot:prepend="{ item, open }">
        <v-icon :color="item.link == 'project' ? 'blue' : item.link == 'portfolio' ? 'primary' : 'pink'" size="16">
          {{ open ? "mdi-folder-open" : "mdi-folder" }}
        </v-icon>
      </template>
      <template v-slot:label="{ item }">
        <div
          class="node-wrapper"
          :class="{ 'active-node': activeNode === item.name }"
          @click="setActiveNode(item.name)"
        >
          <nuxt-link v-if="item.link == 'portfolio'" class="text-decoration-none primary--text" :to="getLink(item)">
            {{ item.name }}
          </nuxt-link>
          <nuxt-link v-if="item.link == 'program'" class="text-decoration-none pink--text" :to="getLink(item)">
            {{ item.name }}
          </nuxt-link>
          <nuxt-link v-if="item.link == 'project'" class="text-decoration-none blue--text" :to="getLink(item)">
            {{ item.name }}
          </nuxt-link>
          <nuxt-link v-if="item.link == 'contract'" class="text-decoration-none primary--text" :to="getLink(item)">
            {{ item.name }}
          </nuxt-link>
        </div>
      </template>
    </v-treeview> -->
    <v-treeview :items="constructedTree"></v-treeview>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex"
import { constructTreeView } from "../helpers/tree-helper"

export default {
  name: "SideBar",
  data: () => ({
    testData: [],
    activeNode: null,
    localPortfolios: [],
    tree: [],
    constructedTree: [],
    treeItems: [],
  }),
  computed: {
    ...mapGetters("portfolios", ["getPortfolios", "getLoading"]),
    renamedPortfolios() {
      return this.renameProperties(this.localPortfolios)
    }
  },
  methods: {
    ...mapActions("portfolios", ["fetchPortfolios"]),
    fetchTree() {
      this.$axios
        .get("/tree_menu")
        .then((res) => {
          this.tree = res.data.data
        })
        .catch((error) => {
          console.log(error.response)
        })
        .finally()
    },
    setActiveNode(nodeName) {
      this.activeNode = nodeName
    },
    getLink(item) {
      if (item.link == "contract") return "/" + "contracts" + "/" + item.id
      return "/" + this.addSToEnd(item.link) + "/" + item.id
    },
    addSToEnd(inputString) {
      if (typeof inputString === "string") {
        return inputString + "s"
      } else {
        return "Input is not a valid string."
      }
    },
    renameProperties(obj) {
      if (obj instanceof Array) {
        return obj.map((item) => this.renameProperties(item))
      } else if (obj instanceof Object) {
        let newObj = {}
        for (let prop in obj) {
          if (obj.hasOwnProperty(prop)) {
            if (prop === "description" && obj.title) {
              newObj.name = obj.title
            } else if (prop === "description") {
              newObj.name = obj.description
            } else if (prop === "programs") {
              newObj.children = this.renameProperties(obj.programs)
            } else if (prop === "projects" || prop === "contracts") {
              newObj.children = this.renameProperties(obj[prop])
            } else {
              newObj[prop] = this.renameProperties(obj[prop])
            }
          }
        }
        return newObj
      }
      return obj
    },

    test() {
      this.$axios
        .get("/stages")
        .then((res) => {
          this.treeItems = this.formatData(res.data.data);
        })
        .catch((error) => {
          console.log(error.response);
        });
    },
    formatData(data) {
      const map = {};
      data.forEach((item) => {
        map[ item.id ] = { ...item, children: [] };
      });

      const tree = [];
      data.forEach((item) => {
        if (item.is_gate) {
          tree.push(map[ item.id ]);
        } else {
          const parentGate = tree.find(gate => gate.order === item.order - 1);
          if (parentGate) {
            parentGate.children.push(map[ item.id ]);
          }
        }
      });

      return tree;
    },
  },
  watch: {
    getPortfolios(newPortfolios) {
      // Watch for changes in the Vuex state and update the local copy
      // Use JSON.parse(JSON.stringify(...)) to create a deep copy of the portfolios
      // This ensures we do not directly mutate the Vuex state, adhering to Vuex best practices
      this.localPortfolios = JSON.parse(JSON.stringify(newPortfolios))
    },
    tree(newVal) {
      this.constructedTree = constructTreeView(newVal)
    }
  },
  mounted() {
    this.fetchTree()
    // Fetch portfolios when the component is mounted
    // Initialize the local copy with the current state from Vuex
    this.fetchPortfolios().then(() => {
      this.localPortfolios = JSON.parse(JSON.stringify(this.getPortfolios))
    })
    
    this.test()
  },

  // created() {
  //   this.test();
  // },


}
</script>

<style>
.active-node {
  background-color: #cbaee4; /* Change the background color as needed */
}
.v-application a {
  color: inherit;
}
.v-treeview-node__root {
  min-height: 20px;
}
.v-treeview-node__content {
  min-height: 20px;
}
.treeview {
  width: 300px;
}
.v-treeview-node__label {
  font-size: 13px;
}
</style>
