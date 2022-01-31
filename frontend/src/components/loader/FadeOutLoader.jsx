export default function FadeOutLoader() {
  try {
    const loader = document.getElementById("loader_main-container");
    loader.style.opacity = "0";
    setTimeout(() => {
      loader.style.opacity = "1";
    }, 400);
  } catch (error) {}
}
