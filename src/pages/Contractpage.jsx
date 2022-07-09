import Layout from "../components/Layout";
import PinataConfig from "../components/PinataConfig";
import ContractInfo from "../components/ContractInfo";

const Contractpage = () => {

  return (
    <Layout>
      <div className="d-flex flex-column align-items-center justify-content-center my-5">
      <h2> 檢查合約狀態 </h2>
        <div> <PinataConfig/> </div>
        <div> <ContractInfo/> </div>
      </div>
    </Layout>
  );
};

export default Contractpage;