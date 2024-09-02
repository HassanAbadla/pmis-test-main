export default function ({ $axios, $cookies, $toast, store }) {
  $axios.setHeader("lang", $cookies.get("lang"))

  $axios.onResponse((res) => {
    if (res.data) {
      if (res.data.message) {
        $toast.showMessage(res.data)
      }
    }
    // console.log(res)
    if (res.data.status == "error") {
      // console.log("errorr")
      let { errors } = res.data
      errors = Object.values(errors)
      errors.map((item) => {
        $toast.showError(item[0])
      })
    }
  })
  $axios.onError((res) => {
    // console.log(res, "error result")
    // console.log(res.response)
    if (res.response.status === 401) {
      store.$auth.logout()
    }
    if (res.response.data.errors) {
      // console.log("errorr")
      let { errors } = res.response.data
      // console.log(errors)
      errors = Object.values(errors)
      errors.forEach((items) => {
        items.forEach((item) => $toast.showError(item))

        // console.log(item, "itemmmmmm")
      })
    }
    if (res.response.data.message) {
      $toast.showError(res.response.data.message)
    }
  })
}
