const driver = require("./../database");

exports.getData = async (req, res, next) => {
  const session = driver.session();
  const query = `MATCH (n:people{id:$id}) return n`;
  const params = {
    id: `${req.body.id}`,
  };
  var data = [];
  session
    .run(query, params)
    .then((results) => {
      results.records.forEach((record) => {
        record._fields.forEach((el) => {
          data.push(el.properties);
        });
      });
      return data;
    })
    .then((data) => res.send(data))
    .catch((err) => console.log(err));
};

exports.addContact = async (req, res, next) => {
  params = {
    relationship: [
      {
        coding: [
          {
            system: "http://terminology.hl7.org/CodeSystem/v2-0131",
            code: "E",
          },
        ],
        text: `"${req.body.relationship}"`,
      },
    ],
    name: {
      use: "official",
      family: `"${req.body.lastName}"`,
      given: [`"${req.body.firstName}"`, `"${req.body.middleName}"`],
    },
    telecom: [
      {
        system: "phone",
        value: `"${req.body.phoneNo}"`,
        use: "mobile",
        rank: 1,
      },
    ],
    address: {
      use: "home",
      type: "postal/physical/both",
      text: `"${req.body.city},${req.body.district},${req.body.state},${req.body.country}"`,
      line: [`"${req.body.streetName}"`],
      city: `"${req.body.city}"`,
      district: `"${req.body.district}"`,
      state: `"${req.body.state}"`,
      country: `"${req.body.country}"`,
      postalCode: `"${req.body.postalCode}"`,
    },
    gender: `"${req.body.gender}"`,
    organization: {
      reference: "Organization/1",
      display: `"${req.body.workplace}"`,
    },
  };
  const session = driver.session();
  const query = `MATCH(n:Patient{value:"${req.body.id}"})
                 MERGE(n)-[:contact{gender:$gender}]->(m:relationship{text:$relationship[0].text})-[:coding]->(:coding{system:$relationship[0].coding[0].system,code:$relationship[0].coding[0].code})
                 MERGE(m)-[:name{use:$name.use,given:$name.given,family:$name.family}]->(:telecom{system:$telecom[0].system,use:$telecom[0].use,value:$telecom[0].value,rank:$telecom[0].rank})
                 MERGE(m)-[:address{ use:$address.use,type:$address.type,text:$address.text,line:$address.line,city:$address.city,district:$address.district,country:$address.country,state:$address.state,postalCode:$address.postalCode}]->(:organiztion{reference:$organization.reference,display:$organization.display})
                  `;
  session
    .run(query, params)
    .then(() => {
      res.send("contact added sucessfully");
    })
    .catch((err) => console.log(err));
};
