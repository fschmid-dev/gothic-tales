import { createApp, h } from "vue";
import i18n from "@/plugins/i18n.js";

/**
 * Renders a Vue component into a temporary DOM element and returns its HTML string.
 * This function creates a new, isolated Vue app instance for the component,
 * applies necessary plugins (like i18n), mounts it, extracts the HTML,
 * and then unmounts the app to clean up.
 *
 * @param {object} component The Vue component to render (e.g., imported component object).
 * @param {object} [props={}] Optional: An object of props to pass to the component.
 * @returns {string} The HTML string of the rendered component.
 */
export function renderVueComponentToHTML(component, props = {}) {
  const container = document.createElement("div");
  const app = createApp({
    render: () => h(component, props),
  });

  // Apply global plugins like i18n if the component expects them from the global context
  // or via props as we're doing for ActionEditForm
  app.use(i18n);

  app.mount(container);
  const htmlContent = container.innerHTML;
  app.unmount(); // Clean up the app instance

  return htmlContent;
}
