<template>
  <header id="header" class="mb-2 bg-dark">
    <div class="container">
      <nav
        class="d-flex justify-content-between navbar navbar-dark navbar-expand align-items-center"
      >
        <a href="#" class="navbar-brand d-flex flex-column align-items-center">
          <!--
          <span>Gothic<span class="text-danger">Tales</span></span>
          <span> Character-Tool </span>
          -->
          <span>Test</span>
        </a>

        <ul id="navbar-default" class="navbar-nav">
          <li class="nav-item">
            <router-link :to="{ name: 'heroes.list' }" class="nav-link">
              Heroes
            </router-link>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>
