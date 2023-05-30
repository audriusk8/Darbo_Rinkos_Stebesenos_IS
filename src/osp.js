const BASE_URL = "https://osp-rs.stat.gov.lt/ords/ipospp/ospp/rest_json/data/";

export const OSP = {
  getDocument: async (name) => {
    const response = await fetch(`${BASE_URL}${name}`);

    return await response.json();
  },
};
