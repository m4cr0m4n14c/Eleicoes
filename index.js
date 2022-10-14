const needle = require("needle");
const BASE_URL = "https://resultados.tse.jus.br";
const ELEICAO1T = "544";
const ELEICAO2T = "545";
var fs = require('fs');

const { Table } = require('console-table-printer');
const p = new Table({
  columns: [
    { name: 'UF', alignment: 'center'}, // with alignment and color
    { name: 'Z.E.', alignment: 'right' },
    { name: 'Eleitores', alignment: 'right' },
    { name: 'Votantes', alignment: 'right' },
    { name: 'Abst%', alignment: 'center' },
    { name: 'Lula', alignment: 'center', color: 'red'  },
    { name: 'Bolso', alignment: 'center', color: 'blue'  },
    { name: 'Branco', alignment: 'center'},
    { name: 'Nulo', alignment: 'center' }
  ]});

var dadosBrasil = JSON.parse(fs.readFileSync('./res/municipios.json', 'utf8'));
dadosBrasil = dadosBrasil.abr

var dados1T = JSON.parse(fs.readFileSync('./res/result1T.json', 'utf8'));

result1TJson = {};

// exibeResultados()

resultTurno(ELEICAO2T);


async function exibeResultados() {
  for(var i=0;i<dadosBrasil.length;i++) {//dadosBrasil.length
    uf = dadosBrasil[i].cd.toLowerCase();
    duf = dados1T.filter(obj=>obj.uf==uf)
    e = duf.reduce((a, b) => a + (parseInt(b.e) || 0), 0);
    tv = duf.reduce((a, b) => a + (b.tv || 0), 0);
    a = (Math.round((1-tv/e)*10000)/100).toFixed(2);
    vb = duf.reduce((a, b) => a + (b.vb || 0), 0);
    vn = duf.reduce((a, b) => a + (b.vn || 0), 0);
    vv = duf.reduce((a, b) => a + (b.vv || 0), 0);
    vbp = (Math.round((vb/vv)*10000)/100)//.toFixed(2);
    vnp = (Math.round((vn/vv)*10000)/100)//.toFixed(2);
    lula = duf.reduce((a, b) => a + (b.lula || 0), 0);
    lulap = (Math.round((lula/vv)*10000)/100).toFixed(2);
    bolso = duf.reduce((a, b) => a + (b.bolso || 0), 0);
    bolsop = (Math.round((bolso/vv)*10000)/100).toFixed(2);
    result1TJson[uf.toUpperCase()] = {"Z.E.": duf.length, "Eleitores": e, "Votantes": tv, "Abst%": a, "Lula": lulap, "Bolso": bolsop, "Branco": vbp, "Nulo": vnp}
    p.addRow({"UF": uf.toUpperCase(),"Z.E.": duf.length, "Eleitores": e, "Votantes": tv, "Abst%": a, "Lula": lulap, "Bolso": bolsop, "Branco": vbp, "Nulo": vnp})
  }
  uf = "BR"
  duf = dados1T;
  e = duf.reduce((a, b) => a + (parseInt(b.e) || 0), 0);
  tv = duf.reduce((a, b) => a + (b.tv || 0), 0);
  a = (Math.round((1-tv/e)*10000)/100).toFixed(2);
  vb = duf.reduce((a, b) => a + (b.vb || 0), 0);
  vn = duf.reduce((a, b) => a + (b.vn || 0), 0);
  vv = duf.reduce((a, b) => a + (b.vv || 0), 0);
  vbp = (Math.round((vb/vv)*10000)/100).toFixed(2);
  vnp = (Math.round((vn/vv)*10000)/100).toFixed(2);
  lula = duf.reduce((a, b) => a + (b.lula || 0), 0);
  lulap = (Math.round((lula/vv)*10000)/100).toFixed(2);
  bolso = duf.reduce((a, b) => a + (b.bolso || 0), 0);
  bolsop = (Math.round((bolso/vv)*10000)/100).toFixed(2);
  result1TJson[uf.toUpperCase()] = {"Z.E.": duf.length, "Eleitores": e, "Votantes": tv, "Abst%": a, "Lula": lulap, "Bolso": bolsop, "Branco": vbp, "Nulo": vnp}
  p.addRow({"UF": uf.toUpperCase(),"Z.E.": duf.length, "Eleitores": e, "Votantes": tv, "Abst%": a, "Lula": lulap, "Bolso": bolsop, "Branco": vbp, "Nulo": vnp}, {color: 'white_bold'})
  // console.table(result1TJson)
  p.printTable();
}

async function resultTurno(turno) {
  result1T = [];
  for(var i=0;i<dadosBrasil.length;i++) {
    resultUF = [];
    uf = dadosBrasil[i];
    console.log("=================================================")
    console.log("Atualizando UF: " + (i+1) + "/" + dadosBrasil.length + " | " + uf.cd + " - " + uf.ds)
    mus = uf.mu
    console.log("Total de " + mus.length + " municipios")
    for(j=0;j<mus.length;j++) { //mus.length
      mu = mus[j]
      console.log("--> Atualizando Municipio: " + uf.cd + " - " + mu.nm) //+ " | " + uf.cd.toLowerCase() +mu.cd + "-c0001-e000" + ELEICAO + "-v.json"
      urlArquivo = BASE_URL + "/oficial/ele2022/" + turno + "/dados/"  + uf.cd.toLowerCase() + "/"  + uf.cd.toLowerCase() +mu.cd + "-c0001-e000" + turno + "-v.json";
      result = await getDados(urlArquivo);
      muDados = result.body;
      zonas = muDados.abr;
      if(!zonas) continue;
      for(k=0;k<zonas.length;k++) {
        z=zonas[k];
        if(z.tpabr!="ZONA") continue;
        console.log("--> Processando ZONA: " + uf.cd + " - " + mu.nm + " | " + z.cdabr)
        lula = z.cand.filter(obj=>obj.n=="13")[0]
        bolso = z.cand.filter(obj=>obj.n=="22")[0]
        resultUF.push({uf: uf.cd.toLowerCase(), cdMu: mu.cd.toString(), cdZona: z.cdabr, e: parseInt(z.e), a: parseInt(z.a), tv: parseInt(z.tv),
          vv: parseInt(z.vvc), vb: parseInt(z.vb), vn: parseInt(z.vn), lula: (lula ? parseInt(lula.vap):0), bolso: (bolso ? parseInt(bolso.vap):0) })
      }
      await delay(150);
    }
    console.log("=================================================")
    fs.writeFileSync('./res/' + uf.cd.toLowerCase() + turno+'.json', JSON.stringify(resultUF), "utf8");
    await delay(3000);
  }
  // fs.writeFileSync('./res/result'+turno+'.json', JSON.stringify(result1T), "utf8");
}

async function getDados(urlArquivo) {
  c=1;
  while(true) {
    try{
      result = await needle("get",urlArquivo);
      return result;
    } catch(e) {
      console.log("Tentativa " +  c + " falhou. Aguardar 15s.");
      await delay(15000);
      c++;
      if(c>5) {
        console.log("Erro na ataulização. Tente mais tarde.");
        return null;
      }
    }
  }
}


function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

async function getMunicipios() {
  // result = await needle("get", BASE_URL + "/oficial/ele2022/545/config/mun-e000545-cm.json");
  result = await needle("get","https://resultados.tse.jus.br/oficial/ele2022/545/dados/sp/sp62910-c0001-e000545-v.json");
  console.log(result.body);
}
