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
var dados2T;

main()

async function main() {
  await resultTurno(ELEICAO2T);
  dados2T = await constroiDados(ELEICAO2T)
  await projetaDados2T()
  exibeResultados()
}




async function exibeResultados() {
  for(var i=0;i<dadosBrasil.length;i++) {//dadosBrasil.length
    uf = dadosBrasil[i].cd.toLowerCase();

    //1T
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
    lulap = (Math.round((lula/vv)*10000)/100);
    bolso = duf.reduce((a, b) => a + (b.bolso || 0), 0);
    bolsop = (Math.round((bolso/vv)*10000)/100);

    //2T
    duf2 = dados2T.filter(obj=>obj.uf==uf)
    tv2 = duf2.reduce((a, b) => a + (b.tvc || 0), 0);
    a2 = duf2.reduce((a, b) => a + (b.ac || 0), 0);
    a2 = (Math.round((a2/e)*10000)/100).toFixed(2);
    vb2 = duf2.reduce((a, b) => a + (b.vbc || 0), 0);
    vn2 = duf2.reduce((a, b) => a + (b.vnc || 0), 0);
    vv2 = duf2.reduce((a, b) => a + (b.vvc || 0), 0);
    vbp2 = (Math.round((vb2/vv2)*10000)/100)//.toFixed(2);
    vnp2 = (Math.round((vn2/vv2)*10000)/100)//.toFixed(2);
    lula2 = duf2.reduce((a, b) => a + (b.lulac || 0), 0);
    lulap2 = (Math.round((lula2/vv2)*10000)/100);
    bolso2 = duf2.reduce((a, b) => a + (b.bolsoc || 0), 0);
    bolsop2 = (Math.round((bolso2/vv2)*10000)/100);
    zecv = duf2.filter(obj=>obj.tv>0).length;

    p.addRow({"UF": uf.toUpperCase(),"Z.E.": duf.length, "Eleitores": e.toLocaleString(), "Votantes": tv.toLocaleString(), "Abst%": a, "Lula": lulap.toFixed(2),
      "Bolso": bolsop.toFixed(2), "Branco": vbp, "Nulo": vnp, "Z.E.(2T)": zecv, "Votantes(2T)":tv2.toLocaleString(), "Abst%(2T)": a2, "Lula(2T)": lulap2.toFixed(2),"Bolso(2T)": bolsop2.toFixed(2)})
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
  lulap = (Math.round((lula/vv)*10000)/100);
  bolso = duf.reduce((a, b) => a + (b.bolso || 0), 0);
  bolsop = (Math.round((bolso/vv)*10000)/100);

  //2T
  duf2 = dados2T;
  tv2 = duf2.reduce((a, b) => a + (b.tvc || 0), 0);
  a2 = duf2.reduce((a, b) => a + (b.ac || 0), 0);
  a2 = (Math.round((a2/e)*10000)/100).toFixed(2);
  vb2 = duf2.reduce((a, b) => a + (b.vbc || 0), 0);
  vn2 = duf2.reduce((a, b) => a + (b.vnc || 0), 0);
  vv2 = duf2.reduce((a, b) => a + (b.vvc || 0), 0);
  vbp2 = (Math.round((vb2/vv2)*10000)/100)//.toFixed(2);
  vnp2 = (Math.round((vn2/vv2)*10000)/100)//.toFixed(2);
  lula2 = duf2.reduce((a, b) => a + (b.lulac || 0), 0);
  lulap2 = (Math.round((lula2/vv2)*10000)/100);
  bolso2 = duf2.reduce((a, b) => a + (b.bolsoc || 0), 0);
  bolsop2 = (Math.round((bolso2/vv2)*10000)/100);
  zecv = duf2.filter(obj=>obj.tv>0).length;

  // p.addRow({"UF": uf.toUpperCase(),"Z.E.": duf.length, "Eleitores": e.toLocaleString(), "Votantes": tv.toLocaleString(), "Abst%": a, "Lula": lulap.toFixed(2), "Bolso": bolsop.toFixed(2), "Branco": vbp, "Nulo": vnp}, {color: 'white_bold'})
  p.addRow({"UF": uf.toUpperCase(),"Z.E.": duf.length, "Eleitores": e.toLocaleString(), "Votantes": tv.toLocaleString(), "Abst%": a, "Lula": lulap.toFixed(2),
    "Bolso": bolsop.toFixed(2), "Branco": vbp, "Nulo": vnp, "Z.E.(2T)": zecv, "Votantes(2T)":tv2.toLocaleString(), "Abst%(2T)": a2, "Lula(2T)": lulap2.toFixed(2),"Bolso(2T)": bolsop2.toFixed(2)})
  p.printTable();
  console.log("# https://github.com/m4cr0m4n14c/Eleicoes\n")

  lt = new Table({title: "LULA TOP 20 EM %"});
  for(l=0;l<20;l++){
    lulaMax = dados1T.sort(function(a,b) {return (b.vv>1000 ? b.lula/b.vv : 0)-(a.vv>1000 ? a.lula/a.vv : 0)})[l]
    mun = dadosBrasil.filter(obj=>obj.cd==lulaMax.uf.toUpperCase())[0]["mu"].filter(m=>m.cd==lulaMax.cdMu)[0]["nm"].replace('&apos;',"\'")
    lt.addRow({"UF": lulaMax.uf.toUpperCase(), "Municipio":  mun, "Zona": lulaMax.cdZona, "Lula%": (Math.round(lulaMax.lula/lulaMax.vv*10000)/100).toFixed(1), "Lula": lulaMax.lula.toLocaleString(), "Bolso": lulaMax.bolso.toLocaleString()})
  }
  lt.printTable();
  console.log("# https://github.com/m4cr0m4n14c/Eleicoes\n")

  lt = new Table({title: "LULA TOP 20"});
  for(l=0;l<20;l++){
    lulaMax = dados1T.sort(function(a,b) {return b.lula-a.lula})[l]
    mun = dadosBrasil.filter(obj=>obj.cd==lulaMax.uf.toUpperCase())[0]["mu"].filter(m=>m.cd==lulaMax.cdMu)[0]["nm"].replace('&apos;',"\'")
    lt.addRow({"UF": lulaMax.uf.toUpperCase(), "Municipio":  mun, "Zona": lulaMax.cdZona, "Lula%": (Math.round(lulaMax.lula/lulaMax.vv*10000)/100).toFixed(1), "Lula": lulaMax.lula.toLocaleString() , "Bolso": lulaMax.bolso.toLocaleString()})
  }
  lt.printTable();
  console.log("# https://github.com/m4cr0m4n14c/Eleicoes\n")

  bt = new Table({title: "BOLSO TOP 20 EM %"});
  for(l=0;l<20;l++){
    bolsoMax = dados1T.sort(function(a,b) {return (b.vv>1000 ? b.bolso/b.vv : 0)-(a.vv>1000 ? a.bolso/a.vv : 0)})[l]
    mun = dadosBrasil.filter(obj=>obj.cd==bolsoMax.uf.toUpperCase())[0]["mu"].filter(m=>m.cd==bolsoMax.cdMu)[0]["nm"].replace('&apos;',"\'")
    bt.addRow({"UF": bolsoMax.uf.toUpperCase(),  "Municipio":  mun, "Zona": bolsoMax.cdZona, "Bolso%": (Math.round(bolsoMax.bolso/bolsoMax.vv*10000)/100).toFixed(1), "Lula": bolsoMax.lula.toLocaleString() , "Bolso": bolsoMax.bolso.toLocaleString()})
  }
  bt.printTable();
  console.log("# https://github.com/m4cr0m4n14c/Eleicoes\n")

  bt = new Table({title: "BOLSO TOP 20"});
  for(l=0;l<20;l++){
    bolsoMax = dados1T.sort(function(a,b) {return b.bolso-a.bolso})[l]
    mun = dadosBrasil.filter(obj=>obj.cd==bolsoMax.uf.toUpperCase())[0]["mu"].filter(m=>m.cd==bolsoMax.cdMu)[0]["nm"].replace('&apos;',"\'")
    bt.addRow({"UF": bolsoMax.uf.toUpperCase(),  "Municipio":  mun, "Zona": bolsoMax.cdZona, "Bolso%": (Math.round(bolsoMax.bolso/bolsoMax.vv*10000)/100).toFixed(1), "Lula": bolsoMax.lula.toLocaleString() , "Bolso": bolsoMax.bolso.toLocaleString()})
  }
  bt.printTable();

}

async function projetaDados2T() {
  for(var s=0;s<dados2T.length;s++) {
    d = dados2T[s]
    pea = d.pst/100;
    if(pea>0) {
      dados2T[s].ac = Math.round(d.a/pea)
      dados2T[s].tvc = Math.round(d.tv/pea)
      dados2T[s].vvc = Math.round(d.vv/pea)
      dados2T[s].vbc = Math.round(d.vb/pea)
      dados2T[s].vnc = Math.round(d.vn/pea)
      dados2T[s].lulac = Math.round(d.lula/pea)
      dados2T[s].bolsoc = Math.round(d.bolso/pea)
    } else {
      d1T = dados1T.filter(obj=>obj.cdMu==d.cdMu)[0]
      dados2T[s].ac = d1T.a
      dados2T[s].tvc = d1T.tv
      dados2T[s].vvc = d1T.vv
      dados2T[s].vbc =d1T.vb
      dados2T[s].vnc = d1T.vn
      dados2T[s].lulac = Math.round(d1T.lula/(d1T.lula+d1T.bolso)*d1T.vv)
      dados2T[s].bolsoc = Math.round(d1T.bolso/(d1T.lula+d1T.bolso)*d1T.vv)
    }
  }
}

async function resultTurno(turno) {
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
          vv: parseInt(z.vvc), vb: parseInt(z.vb), vn: parseInt(z.vn), lula: (lula ? parseInt(lula.vap):0), bolso: (bolso ? parseInt(bolso.vap):0), pst: parseFloat(z.pea.replace(",","."))})
      }
      await delay(10);
    }
    console.log("=================================================")
    fs.writeFileSync('./res/' + uf.cd.toLowerCase() + turno+'.json', JSON.stringify(resultUF), "utf8");
    await delay(2000);
  }
  // fs.writeFileSync('./res/result'+turno+'.json', JSON.stringify(result1T), "utf8");
}

async function constroiDados(turno) {
  resp = [];
  for(var i=0;i<dadosBrasil.length;i++) {
    uf = dadosBrasil[i].cd.toLowerCase();
    var dadosUF = JSON.parse(fs.readFileSync('./res/' + uf + turno + '.json', 'utf8'));
    resp = resp.concat(dadosUF);
  }
  return resp;
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

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

async function getMunicipios() {
  // result = await needle("get", BASE_URL + "/oficial/ele2022/545/config/mun-e000545-cm.json");
  result = await needle("get","https://resultados.tse.jus.br/oficial/ele2022/545/dados/sp/sp62910-c0001-e000545-v.json");
  console.log(result.body);
}
