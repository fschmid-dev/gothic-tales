import { useI18n } from "vue-i18n";
import Swal from "sweetalert2";

export function useDeleteHeroModal() {
  const { t } = useI18n();

  const showDeleteHeroModal = (hero, callback) => {
    Swal.fire({
      title: t("deleteHero.title", { name: hero.name }),
      text: t("deleteHero.text"),
      icon: "warning",
      confirmButtonText: t("delete"),
      confirmButtonColor: "var(--bs-primary)",
      showCancelButton: true,
      cancelButtonColor: "var(--bs-danger)",
      cancelButtonText: t("cancel"),
      preConfirm: () => {
        if (callback) {
          callback();
        }

        Swal.fire({
          title: t("deleteHero.deletedModal.title", { name: hero.name }),
          html: t("deleteHero.deletedModal.text"),
          icon: "success",
          timer: 2000,
          timerProgressBar: true,
          confirmButtonText: t("close"),
        });
      },
    });
  };

  return { showDeleteHeroModal };
}
