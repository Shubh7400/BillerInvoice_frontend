
import SelectClient from "../../components/Client_Component/ClientPageHeader";
import ProjectTable from "../../components/Project_Component/ProjectTable";
import BillAmount from "../../components/Invoice_Component/BillAmount";
const Home = () => {
  return (
    <main className=" bg-slate-200 dark:bg-slate-700 min-h-[150vh] text-colorDarkFont dark:text-colorLightFont overflow-x-hidden ">
      <SelectClient />
      <ProjectTable projectTableforClient={false} />
      <BillAmount />
    </main>
  );
};

export default Home;
