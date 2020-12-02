const routes = [{
  // catch-all to redirect to home view if no route matched
  path: '*',
  redirect: '/wxm/'
}, {
  // the home page
  name: 'Home',
  path: '/wxm/',
  component: () => import(`../views/home.vue`)
}]
export default routes