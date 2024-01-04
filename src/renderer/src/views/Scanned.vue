<template>
  <div class="flex flex-row justify-between items-center">
    <p class="text-2xl text-slate-800 text-wrap font-medium">Scanned Documents</p>
  </div>

  <p class="text-2xl text-gray-500">{{ members }}</p>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      members: [],
    };
  },
  methods: {
    getMembers() {
      const path = "http://127.0.0.1:5000/members";
      axios
        .get(path)
        .then((res) => {
          this.members = res.data.members[0];
          console.log(res);
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
  created() {
    this.getMembers();
  },
};
</script>

<style lang="scss" scoped></style>
