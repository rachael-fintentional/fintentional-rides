import { useState, useEffect, useRef, useCallback } from "react";

const P = {
  cream:"#FFF9F0",mint:"#B8E8D0",mintD:"#7EC8B8",lav:"#C8B8E8",
  lavD:"#9B87D4",peach:"#FFB5A7",peachD:"#FF8C7C",sky:"#A8D8EA",
  skyD:"#6BB8D6",rose:"#F2C4CE",yellow:"#FFF0B3",char:"#2D3436",
  gray:"#636E72",lgray:"#DFE6E9",white:"#FFFFFF",
};
const fl=document.createElement("link");
fl.href="https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&family=Fredoka:wght@500;600;700&display=swap";
fl.rel="stylesheet";document.head.appendChild(fl);

/* ── math helpers ── */
const pmtCalc=(principal,annualRate,months)=>{
  const pr=Number(principal)||0;if(pr<=0||months<=0)return 0;
  const r=Number(annualRate)/100/12;if(r===0)return pr/months;
  return pr*r*Math.pow(1+r,months)/(Math.pow(1+r,months)-1);
};
const n$=v=>Number(v)||0;
const calcStaggered=(savPerCar,numCars=9,ypc=5,rate=0.07)=>{
  let t=0;for(let i=0;i<numCars;i++)t+=savPerCar*Math.pow(1+rate,(numCars-1-i)*ypc);return Math.round(t);
};

/* ── ui ── */
const Phone=({children,bottomNav})=>(
  <div style={{display:"flex",justifyContent:"center",alignItems:"center",minHeight:"100vh",background:"#F0EDE6",fontFamily:"'Quicksand',sans-serif",padding:"12px 0"}}>
    <div style={{width:390,height:844,background:"#000",borderRadius:52,padding:12,boxShadow:"0 25px 80px rgba(0,0,0,.2),inset 0 0 0 2px #333",position:"relative"}}>
      <div style={{width:"100%",height:"100%",background:P.cream,borderRadius:42,overflow:"hidden",position:"relative",display:"flex",flexDirection:"column"}}>
        <div style={{position:"absolute",top:10,left:"50%",transform:"translateX(-50%)",width:126,height:36,background:"#000",borderRadius:20,zIndex:100}}/>
        <div style={{height:56,display:"flex",justifyContent:"space-between",alignItems:"flex-end",padding:"0 28px 4px",flexShrink:0,zIndex:50,fontSize:14,fontWeight:600,color:P.char}}>
          <span>9:41</span><div style={{width:126}}/>
          <div style={{display:"flex",gap:5,alignItems:"center"}}>
            <svg width="17" height="12" viewBox="0 0 17 12"><rect x="0" y="0" width="3" height="12" rx="1" fill={P.char}/><rect x="4.5" y="3" width="3" height="9" rx="1" fill={P.char}/><rect x="9" y="5.5" width="3" height="6.5" rx="1" fill={P.char}/><rect x="13.5" y="8" width="3" height="4" rx="1" fill={P.char}/></svg>
            <div style={{width:27,height:13,border:`2px solid ${P.char}`,borderRadius:4,padding:"1.5px",position:"relative"}}><div style={{width:"75%",height:"100%",background:"#4CD964",borderRadius:2}}/><div style={{position:"absolute",right:-5,top:3,width:2.5,height:5,background:P.char,borderRadius:"0 2px 2px 0"}}/></div>
          </div>
        </div>
        <div style={{flex:1,overflow:"hidden",display:"flex",flexDirection:"column"}}>{children}</div>
        {bottomNav}
        <div style={{height:24,display:"flex",justifyContent:"center",alignItems:"center",flexShrink:0}}><div style={{width:140,height:5,background:P.char,borderRadius:3,opacity:.2}}/></div>
      </div>
    </div>
  </div>
);
const Scroll=({children})=>(<div style={{flex:1,overflowY:"auto",overflowX:"hidden",padding:"0 20px 16px",WebkitOverflowScrolling:"touch"}}>{children}</div>);
const Btn=({children,onClick,color=P.mintD,tc="#fff",disabled,small,style={}})=>(<button onClick={onClick} disabled={disabled} style={{background:disabled?P.lgray:color,color:disabled?P.gray:tc,border:"none",borderRadius:small?12:16,padding:small?"8px 16px":"14px 24px",fontSize:small?13:16,fontWeight:600,fontFamily:"'Quicksand',sans-serif",cursor:disabled?"not-allowed":"pointer",width:small?"auto":"100%",boxShadow:disabled?"none":`0 4px 15px ${color}44`,transition:"all .2s",...style}}>{children}</button>);
const Inp=({label,value,onChange,placeholder,type="text",prefix,suffix})=>(<div style={{marginBottom:12}}>{label&&<label style={{fontSize:13,fontWeight:600,color:P.gray,display:"block",marginBottom:4}}>{label}</label>}<div style={{position:"relative",display:"flex",alignItems:"center"}}>{prefix&&<span style={{position:"absolute",left:12,color:P.gray,fontWeight:600,fontSize:15,zIndex:1}}>{prefix}</span>}<input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={{width:"100%",padding:`12px ${suffix?"40px":"14px"} 12px ${prefix?"28px":"14px"}`,border:`2px solid ${P.lgray}`,borderRadius:14,fontSize:15,fontFamily:"'Quicksand',sans-serif",fontWeight:500,color:P.char,background:P.white,outline:"none",boxSizing:"border-box",transition:"border-color .2s"}} onFocus={e=>e.target.style.borderColor=P.mintD} onBlur={e=>e.target.style.borderColor=P.lgray}/>{suffix&&<span style={{position:"absolute",right:12,color:P.gray,fontSize:13,fontWeight:500}}>{suffix}</span>}</div></div>);
const Sel=({label,value,onChange,options,placeholder})=>(<div style={{marginBottom:12}}>{label&&<label style={{fontSize:13,fontWeight:600,color:P.gray,display:"block",marginBottom:4}}>{label}</label>}<select value={value} onChange={e=>onChange(e.target.value)} style={{width:"100%",padding:"12px 14px",border:`2px solid ${P.lgray}`,borderRadius:14,fontSize:15,fontFamily:"'Quicksand',sans-serif",fontWeight:500,color:value?P.char:P.gray,background:P.white,outline:"none",appearance:"none",boxSizing:"border-box",backgroundImage:`url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23636E72' stroke-width='2' fill='none'/%3E%3C/svg%3E")`,backgroundRepeat:"no-repeat",backgroundPosition:"right 14px center"}}><option value="" disabled>{placeholder||"Select..."}</option>{options.map(o=><option key={typeof o==="string"?o:o.value} value={typeof o==="string"?o:o.value}>{typeof o==="string"?o:o.label}</option>)}</select></div>);
const Card=({children,bg=P.white,style={}})=>(<div style={{background:bg,borderRadius:18,padding:16,boxShadow:"0 2px 12px rgba(0,0,0,.06)",...style}}>{children}</div>);
const Tag=({children,color=P.mint})=>(<span style={{background:color,borderRadius:8,padding:"4px 10px",fontSize:11,fontWeight:700,color:P.char,display:"inline-block"}}>{children}</span>);
const Dots=({c,t})=>(<div style={{display:"flex",gap:6,justifyContent:"center",padding:"8px 0"}}>{Array.from({length:t},(_,i)=>(<div key={i} style={{width:i===c?24:8,height:8,borderRadius:4,transition:"all .3s",background:i===c?P.mintD:i<c?P.lav:P.lgray}}/>))}</div>);
const Tip=({children,color=P.yellow,icon="\u{1F4A1}"})=>(<div style={{background:color+"66",borderRadius:14,padding:"12px 14px",display:"flex",gap:10,alignItems:"flex-start",margin:"12px 0",border:`1.5px solid ${color}`}}><span style={{fontSize:18,flexShrink:0,lineHeight:1.4}}>{icon}</span><div style={{fontSize:13,fontWeight:500,color:P.char,lineHeight:1.5}}>{children}</div></div>);
const $=v=>{const n=Math.round(n$(v));return n===0?"$0":"$"+n.toLocaleString();};
const SBtn=({icon,label,color,onClick})=>(<button onClick={onClick} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4,background:"none",border:"none",cursor:"pointer",padding:6,fontFamily:"'Quicksand',sans-serif"}}><div style={{width:44,height:44,borderRadius:12,background:color,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 3px 10px ${color}44`}}>{icon}</div><span style={{fontSize:10,fontWeight:600,color:P.gray}}>{label}</span></button>);

const TABS=[{id:4,icon:"\u{1F9EE}",label:"Payments"},{id:5,icon:"\u{1F6E1}\uFE0F",label:"Add-Ons"},{id:6,icon:"\u{1F3AF}",label:"Alts"},{id:7,icon:"\u{1F4B8}",label:"True Cost"},{id:8,icon:"\u{1F52E}",label:"Lifetime"},{id:9,icon:"\u{1F4E3}",label:"Share"}];
const TabBar=({step,setStep})=>(<div style={{flexShrink:0,display:"flex",justifyContent:"space-around",alignItems:"center",padding:"6px 4px 2px",background:P.white,borderTop:`1px solid ${P.lgray}`}}>{TABS.map(t=>{const a=t.id===step;return(<button key={t.id} onClick={()=>setStep(t.id)} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:1,background:"none",border:"none",cursor:"pointer",padding:"2px 4px",fontFamily:"'Quicksand',sans-serif",opacity:a?1:0.5,transition:"all .2s",transform:a?"scale(1.05)":"scale(1)"}}><span style={{fontSize:16,lineHeight:1}}>{t.icon}</span><span style={{fontSize:9,fontWeight:a?700:500,color:a?P.mintD:P.gray}}>{t.label}</span>{a&&<div style={{width:16,height:2.5,borderRadius:2,background:P.mintD,marginTop:1}}/>}</button>);})}</div>);

/* Affordability bar */
const Gauge=({pct,label,subtitle})=>{const c=pct<=15?P.mintD:pct<=25?"#E8B830":pct<=35?P.peach:P.peachD;const msg=pct<=15?"Comfortable":pct<=25?"Manageable":pct<=35?"Stretching":pct>50?"\u{1F6A8} Danger":"Too much car";return(<div style={{background:c+"22",borderRadius:14,padding:"10px 14px",border:`1.5px solid ${c}`,margin:"10px 0"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}><span style={{fontSize:12,fontWeight:600,color:P.char}}>{label}</span><span style={{fontSize:13,fontWeight:700,color:c}}>{Math.round(pct)}% — {msg}</span></div><div style={{width:"100%",height:8,background:P.lgray,borderRadius:4,overflow:"hidden"}}><div style={{width:`${Math.min(pct,100)}%`,height:"100%",borderRadius:4,background:c,transition:"width .5s"}}/></div><div style={{display:"flex",justifyContent:"space-between",marginTop:4}}>{subtitle?<span style={{fontSize:9,color:P.gray}}>{subtitle}</span>:<><span style={{fontSize:9,color:P.gray}}>0%</span><span style={{fontSize:9,color:P.gray,fontWeight:600}}>35% max recommended</span><span style={{fontSize:9,color:P.gray}}>50%+</span></>}</div></div>);};

/* ═══ MAIN ═══ */
export default function App(){
  const [step,setStep]=useState(0);
  const [car,setCar]=useState({make:"",model:"",year:"2025",isNew:"new",msrp:""});
  const [fin,setFin]=useState({down:"",income:"",hasTrade:false});
  const [trade,setTrade]=useState({make:"",model:"",year:"2018",mileage:"",condition:"good"});
  const [results,setResults]=useState(null);
  const [loading,setLoading]=useState(false);
  const [err,setErr]=useState(null);
  const [chosen,setChosen]=useState(null);
  const [tipIdx,setTipIdx]=useState(0);
  const [progress,setProgress]=useState(0);
  const pRef=useRef(null);

  /* progress bar */
  useEffect(()=>{if(step!==3){setProgress(0);return;}let p=0;const iv=setInterval(()=>{if(p<30)p+=2;else if(p<60)p+=0.8;else if(p<75)p+=0.3;else if(p<85)p+=0.1;setProgress(Math.min(p,85));},200);pRef.current=iv;return()=>clearInterval(iv);},[step]);
  useEffect(()=>{if(results&&step===3){if(pRef.current)clearInterval(pRef.current);setProgress(100);}},[results,step]);
  useEffect(()=>{if(step!==3)return;const iv=setInterval(()=>setTipIdx(i=>(i+1)%5),2500);return()=>clearInterval(iv);},[step]);
  const tips=["Searching real-time market prices...","Calculating what the dealer doesn't want you to know...","Finding cars that won't make your wallet cry...","Running the math your F&I guy hopes you skip...","Comparing depreciation curves (riveting stuff)..."];

  /* ── Derived calcs (client-side, bulletproof) ── */
  const getCalcs=useCallback(()=>{
    if(!results)return {};
    const tc=results.trueCost||{};
    const tg=tc.target||{};
    const al=tc.bestAlternative||{};

    // FIX #1: Always compute loan client-side from best available MSRP
    const msrp=n$(results.targetCar?.msrp)||n$(car.msrp);
    const down=n$(fin.down);
    const tradeVal=n$(results.tradeIn?.estimatedDealerOffer);
    const loan=Math.max(0, msrp-down-tradeVal);

    // 60-month calcs (good credit) — always client-side
    const mo60good=Math.round(pmtCalc(loan,5.5,60));
    const int60good=Math.round(pmtCalc(loan,5.5,60)*60-loan);

    // 72-month calcs (good credit) — always client-side
    const mo72good=Math.round(pmtCalc(loan,6.2,72));
    const int72good=Math.round(pmtCalc(loan,6.2,72)*72-loan);
    const extraInt72=int72good-int60good;

    // Ownership costs (all with explicit Number)
    const tgIns=n$(tg.annualInsurance);
    const tgGas=n$(tg.annualGas);
    const tgMnt=n$(tg.annualMaintenance);
    const tgDep=n$(tg.annualDepreciation);
    const tgPrk=n$(tg.annualParking);
    const tgAnnOwn=tgIns+tgGas+tgMnt+tgDep+tgPrk;

    const alIns=n$(al.annualInsurance);
    const alGas=n$(al.annualGas);
    const alMnt=n$(al.annualMaintenance);
    const alDep=n$(al.annualDepreciation);
    const alPrk=n$(al.annualParking);
    const alAnnOwn=alIns+alGas+alMnt+alDep+alPrk;

    // FIX #2: Monthly true cost = loan payment + ownership costs
    const tgMonthlyOwnership=Math.round(tgAnnOwn/12);
    const tgMonthlyAll=mo60good+tgMonthlyOwnership;

    // Smart pick monthly (used alt = alternatives[2])
    const altPrice=n$(results.alternatives?.[2]?.price);
    const altLoan=Math.max(0,altPrice-down);
    const alMo60=Math.round(pmtCalc(altLoan,5.5,60));
    const alMonthlyOwnership=Math.round(alAnnOwn/12);
    const alMonthlyAll=alMo60+alMonthlyOwnership;

    // FIX #3+4: Affordability — income-based
    const grossMo=n$(fin.income)/12;
    const takeMo=grossMo*0.72; // approx take-home after taxes

    // Payments tab: loan payment as % of take-home pay
    const pctPaymentVsTake=takeMo>0?(mo60good/takeMo)*100:0;

    // True Cost tab: ALL-IN monthly cost as % of take-home pay (different angle)
    const pctAllInVsTake=takeMo>0?(tgMonthlyAll/takeMo)*100:0;

    // FIX #5: Lifetime savings from 5yr TRUE COST differential (not just sticker)
    // Client-side: 5yr total = (60 months of loan payments) + (5 years of ownership costs)
    const tgFiveYrTotal=(mo60good*60)+(tgAnnOwn*5);
    const alFiveYrTotal=(alMo60*60)+(alAnnOwn*5);
    const fiveYrSave=Math.max(0,tgFiveYrTotal-alFiveYrTotal);
    const perCarSave=fiveYrSave;
    const staggered=calcStaggered(perCarSave,9,5,0.07);
    const rawTotal=perCarSave*9;

    return {loan,msrp,mo60good,mo72good,int60good,int72good,extraInt72,
      tgAnnOwn,alAnnOwn,tgMonthlyOwnership,tgMonthlyAll,
      alMo60,alMonthlyOwnership,alMonthlyAll,
      pctPaymentVsTake,pctAllInVsTake,grossMo,takeMo,
      perCarSave,staggered,rawTotal,fiveYrSave,
      tgFiveYrTotal,alFiveYrTotal};
  },[results,car.msrp,fin.down,fin.income]);

  /* ── AI Call ── */
  const doAnalysis=useCallback(async()=>{
    setLoading(true);setErr(null);
    const msrpNote=car.msrp?`- Price/MSRP: $${car.msrp}`:`- Price/MSRP: NOT PROVIDED — search the web for the current base MSRP/market price`;
    const incomeNote=fin.income?`- Household gross annual income: $${fin.income}`:"";

    const targetName=`${car.year} ${car.make} ${car.model}`;

    const prompt=`You are a witty car financial advisor. Analyze this purchase. You MUST search the web for real current pricing.

TARGET: ${targetName} (${car.isNew==="new"?"NEW":"USED"})
${msrpNote}
- Down payment: $${fin.down||0}
${incomeNote}
${fin.hasTrade?`- Trade-in: ${trade.year} ${trade.make} ${trade.model}, ${trade.mileage} miles, ${trade.condition} condition`:"- No trade-in"}

Search the web, then respond ONLY with a JSON object. No markdown. No backticks. No text before or after.

{"targetCar":{"name":"${targetName} [trim]","msrp":number,"category":"string"},
"tradeIn":{"estimatedKBB":number_or_null,"estimatedDealerOffer":number_or_null,"difference":number_or_null,"tip":"witty string"},
"payments":{"loanAmount":number,"good":{"rate":5.5,"monthly":number,"totalPaid":number,"totalInterest":number},"average":{"rate":8.5,"monthly":number,"totalPaid":number,"totalInterest":number},"bad":{"rate":13.5,"monthly":number,"totalPaid":number,"totalInterest":number}},
"seventyTwoMonth":{"underwaterMonths":number,"roast":"funny 1-2 sentences about being underwater on a 72mo loan"},
"alternatives":[{"name":"NEW car","price":number,"savings":number,"monthlyPayment":number,"whyBetter":"1-2 sentences","tag":"Best Value"},{"name":"another NEW","price":number,"savings":number,"monthlyPayment":number,"whyBetter":"1-2 sentences","tag":"Reliability King"},{"name":"USED 2-3yr old version","price":number,"savings":number,"monthlyPayment":number,"whyBetter":"mention depreciation cliff","tag":"Fintentional Pick"}],
"dealerAddOns":[{"name":"Gap Insurance","dealerPrice":number,"realValue":number,"verdict":"skip_or_maybe_or_worth_it","explanation":"funny 1-2 sentences","emoji":"\u{1F512}"},{"name":"Extended Warranty","dealerPrice":number,"realValue":number,"verdict":"skip_or_maybe_or_worth_it","explanation":"funny","emoji":"\u{1F6E1}\uFE0F"},{"name":"Paint Protection Film","dealerPrice":number,"realValue":number,"verdict":"skip_or_maybe_or_worth_it","explanation":"funny","emoji":"\u{1F3A8}"},{"name":"Fabric/Interior Protection","dealerPrice":number,"realValue":number,"verdict":"skip_or_maybe_or_worth_it","explanation":"funny","emoji":"\u{1F9F4}"},{"name":"Tire & Wheel Package","dealerPrice":number,"realValue":number,"verdict":"skip_or_maybe_or_worth_it","explanation":"funny","emoji":"\u{1F6DE}"},{"name":"Nitrogen Tire Fill","dealerPrice":number,"realValue":number,"verdict":"skip_or_maybe_or_worth_it","explanation":"funny","emoji":"\u{1FAE7}"}],
"trueCost":{"target":{"annualInsurance":number,"annualGas":number,"annualMaintenance":number,"annualDepreciation":number,"annualParking":1200,"annualTotal":number,"fiveYearTotal":number},"bestAlternative":{"annualInsurance":number,"annualGas":number,"annualMaintenance":number,"annualDepreciation":number,"annualParking":1200,"annualTotal":number,"fiveYearTotal":number},"fiveYearSavings":number},
"lifetimeMath":{"funnyComparison":"hilarious specific comparison of total dollar savings"},
"quotes":{
"splurge":"A funny proud quote about choosing the ${targetName} specifically. ONLY mention this car by name. Own it. Tone: 'I ran the numbers on my ${targetName}. I saw the truth. Getting it anyway.' Do NOT reference any alternative.",
"bargain":"A triumphant quote about choosing the smarter used alternative by its specific name. ONLY mention the alternative car by name. Celebrate the smart pick. Do NOT reference the ${targetName} at all."
}}

RULES:
- verdict: "skip","maybe","worth_it"
- loanAmount = msrp - down_payment - dealer_trade_offer. THIS MUST BE A POSITIVE NUMBER.
- Monthly payment: M = P*r*(1+r)^n / ((1+r)^n-1) where r=rate/100/12, n=months
- fiveYearTotal = (good credit 60mo monthly * 60) + (annualTotal * 5)
- fiveYearSavings = target.fiveYearTotal - bestAlternative.fiveYearTotal
- alternatives monthlyPayment = (altPrice - downPayment) at 5.5% for 60 months
- QUOTES CRITICAL: "splurge" must ONLY name the target car (${targetName}). "bargain" must ONLY name the used alternative. Neither quote should mention the other car. They are independent statements.

ONLY the JSON object.`;

    try{
      const resp=await fetch("/api/analyze",{method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({prompt})});
      if(!resp.ok)throw new Error(`API ${resp.status}`);
      const data=await resp.json();
      if(data.error)throw new Error(data.error.message);
      let txt="";
      if(data.content&&Array.isArray(data.content)){for(const b of data.content)if(b.type==="text"&&b.text)txt+=b.text+"\n";}
      if(!txt.trim())throw new Error("Empty response");
      let js=txt.replace(/```json\s*/gi,"").replace(/```\s*/gi,"").trim();
      const f=js.indexOf("{"),l=js.lastIndexOf("}");
      if(f===-1||l===-1||l<=f)throw new Error("No JSON");
      js=js.slice(f,l+1);
      const parsed=JSON.parse(js);
      if(!parsed.targetCar||!parsed.payments)throw new Error("Missing fields");
      setResults(parsed);
      setTimeout(()=>setStep(4),600);
    }catch(e){console.error(e);setErr(e.message);}finally{setLoading(false);}
  },[car,fin,trade]);

  useEffect(()=>{if(step===3&&!results)doAnalysis();},[step]);
  const estSec=fin.hasTrade?35:25;
  const showTabs=step>=4&&results;
  const tabBar=showTabs?<TabBar step={step} setStep={setStep}/>:null;
  const C=getCalcs();

  /* ═══ STEP 0: WELCOME ═══ */
  if(step===0)return(<Phone><div style={{flex:1,display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",padding:24,textAlign:"center"}}>
    <div style={{width:100,height:100,borderRadius:28,background:`linear-gradient(135deg,${P.mint},${P.lav})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:48,marginBottom:20,boxShadow:`0 8px 30px ${P.mint}66`}}>{"\u{1F697}"}</div>
    <h1 style={{fontFamily:"'Fredoka',sans-serif",fontSize:34,fontWeight:600,color:P.char,margin:"0 0 4px",lineHeight:1.1}}>Fintentional Rides</h1>
    <p style={{fontSize:14,color:P.gray,margin:"0 0 24px",fontWeight:500}}>The true cost of that car you're eyeing {"\u{1F440}"}</p>
    <Card bg={P.yellow+"44"} style={{marginBottom:20,textAlign:"left"}}><p style={{margin:0,fontSize:13,lineHeight:1.6,color:P.char,fontWeight:500}}>Your budget app tracks every latte. It has <strong>zero opinion</strong> on whether your next car is a $50,000 mistake.</p><p style={{margin:"8px 0 0",fontSize:12,color:P.gray,fontStyle:"italic"}}>— The Fintentional Framework</p></Card>
    <p style={{fontSize:13,color:P.gray,margin:"0 0 24px",lineHeight:1.5}}>We'll show you what that car <em>really</em> costs, find smarter alternatives, and do the lifetime math your dealer hopes you never see.</p>
    <Btn onClick={()=>setStep(1)}>Let's Do This →</Btn>
  </div></Phone>);

  /* ═══ STEP 1: CAR ═══ */
  if(step===1)return(<Phone><div style={{padding:"12px 20px 0"}}><Dots c={0} t={3}/><h2 style={{margin:"8px 0 4px",fontSize:22,fontWeight:700,color:P.char}}>What are you eyeing? {"\u{1F440}"}</h2><p style={{margin:"0 0 12px",fontSize:13,color:P.gray}}>Tell us about your dream machine</p></div><Scroll>
    <div style={{display:"flex",gap:8,marginBottom:12}}>{["new","used"].map(t=>(<button key={t} onClick={()=>setCar(d=>({...d,isNew:t}))} style={{flex:1,padding:10,borderRadius:12,border:`2px solid ${car.isNew===t?P.mintD:P.lgray}`,background:car.isNew===t?P.mint+"44":P.white,fontFamily:"'Quicksand',sans-serif",fontSize:14,fontWeight:600,color:P.char,cursor:"pointer"}}>{t==="new"?"\u2728 New":"\u{1F504} Used"}</button>))}</div>
    <Inp label="Make" value={car.make} onChange={v=>setCar(d=>({...d,make:v}))} placeholder="e.g. Toyota, BMW, Honda..."/>
    <Inp label="Model" value={car.model} onChange={v=>setCar(d=>({...d,model:v}))} placeholder="e.g. Camry, X5, Civic..."/>
    <div style={{display:"flex",gap:10}}><div style={{flex:1}}><Sel label="Year" value={car.year} onChange={v=>setCar(d=>({...d,year:v}))} options={Array.from({length:9},(_,i)=>String(2026-i))}/></div><div style={{flex:1}}><Inp label={`${car.isNew==="new"?"MSRP":"Price"} (optional)`} value={car.msrp} onChange={v=>setCar(d=>({...d,msrp:v.replace(/[^0-9]/g,"")}))} placeholder="We'll look it up" prefix="$" type="tel"/></div></div>
    <Tip color={P.sky} icon={"\u{1F9E0}"}><strong>Fintentional tip:</strong> New cars lose 20-30% of value the moment you drive off the lot. That depreciation is someone else's problem if you buy used.</Tip>
    <Btn onClick={()=>setStep(2)} disabled={!car.make||!car.model}>Next: The Money Part →</Btn>
  </Scroll></Phone>);

  /* ═══ STEP 2: FINANCE + INCOME (income required) ═══ */
  if(step===2){
    const incomeValid=n$(fin.income)>=10000;
    const canProceed=incomeValid&&(!fin.hasTrade||( trade.make&&trade.model&&trade.mileage));
    return(<Phone><div style={{padding:"12px 20px 0"}}><Dots c={1} t={3}/><h2 style={{margin:"8px 0 4px",fontSize:22,fontWeight:700,color:P.char}}>Show Me The Money {"\u{1F4B0}"}</h2><p style={{margin:"0 0 12px",fontSize:13,color:P.gray}}>So we can tell you if this car fits your life</p></div><Scroll>

    {/* FIX #3: Income is first and required */}
    <Card bg={P.sky+"22"} style={{marginBottom:14,border:`1.5px solid ${P.sky}`}}>
      <p style={{margin:"0 0 2px",fontSize:14,fontWeight:700,color:P.char}}>{"\u{1F4CA}"} Your Household Income</p>
      <p style={{margin:"0 0 8px",fontSize:11,color:P.gray}}>Required — we use this to check if the car fits your budget</p>
      <Inp label="Household Gross Annual Income" value={fin.income} onChange={v=>setFin(d=>({...d,income:v.replace(/[^0-9]/g,"")}))} placeholder="e.g. 85000" prefix="$" type="tel"/>
      {fin.income && !incomeValid && <p style={{margin:"-8px 0 4px",fontSize:11,color:P.peachD,fontWeight:600}}>Enter your full annual income (at least $10,000)</p>}
      {incomeValid&&(<div style={{background:P.mint+"33",borderRadius:10,padding:"6px 10px",display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontSize:11,color:P.gray}}>Est. monthly take-home</span><span style={{fontSize:13,fontWeight:700,color:P.mintD}}>~{$(n$(fin.income)/12*0.72)}/mo</span></div>)}
    </Card>

    <Inp label="Down Payment" value={fin.down} onChange={v=>setFin(d=>({...d,down:v.replace(/[^0-9]/g,"")}))} placeholder="5,000" prefix="$" type="tel"/>
    <Card style={{marginBottom:16}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><p style={{margin:0,fontSize:14,fontWeight:600,color:P.char}}>Trading in a vehicle?</p><p style={{margin:"2px 0 0",fontSize:12,color:P.gray}}>We'll estimate KBB vs. dealer offer</p></div><button onClick={()=>setFin(d=>({...d,hasTrade:!d.hasTrade}))} style={{width:52,height:30,borderRadius:15,background:fin.hasTrade?P.mintD:P.lgray,border:"none",cursor:"pointer",position:"relative",transition:"all .3s"}}><div style={{width:24,height:24,borderRadius:12,background:P.white,position:"absolute",top:3,left:fin.hasTrade?25:3,transition:"all .3s",boxShadow:"0 2px 4px rgba(0,0,0,.15)"}}/></button></div></Card>
    {fin.hasTrade&&(<div style={{background:P.lav+"33",borderRadius:16,padding:14,marginBottom:16,border:`1.5px solid ${P.lav}`}}>
      <p style={{margin:"0 0 10px",fontSize:13,fontWeight:600,color:P.char}}>{"\u{1F699}"} Your trade-in</p>
      <Inp label="Make" value={trade.make} onChange={v=>setTrade(d=>({...d,make:v}))} placeholder="e.g. Honda"/>
      <Inp label="Model" value={trade.model} onChange={v=>setTrade(d=>({...d,model:v}))} placeholder="e.g. Civic"/>
      <div style={{display:"flex",gap:10}}><div style={{flex:1}}><Sel label="Year" value={trade.year} onChange={v=>setTrade(d=>({...d,year:v}))} options={Array.from({length:16},(_,i)=>String(2025-i))}/></div><div style={{flex:1}}><Inp label="Mileage" value={trade.mileage} onChange={v=>setTrade(d=>({...d,mileage:v.replace(/[^0-9]/g,"")}))} placeholder="65,000" suffix="mi" type="tel"/></div></div>
      <Sel label="Condition" value={trade.condition} onChange={v=>setTrade(d=>({...d,condition:v}))} options={[{value:"excellent",label:"Excellent — basically a unicorn"},{value:"good",label:"Good — normal human car"},{value:"fair",label:"Fair — it has character"},{value:"poor",label:"Poor — prayers included"}]}/>
      <Tip color={P.peach} icon={"\u26A0\uFE0F"}><strong>Dealer playbook:</strong> Dealers typically offer 15-25% below KBB. They know you're already committed to the new car.</Tip>
    </div>)}
    <div style={{display:"flex",gap:10}}><Btn onClick={()=>setStep(1)} color={P.lgray} tc={P.char} style={{flex:1}}>← Back</Btn><Btn onClick={()=>{setResults(null);setErr(null);setProgress(0);setStep(3);}} style={{flex:2}} disabled={!canProceed}>Analyze My Ride {"\u{1F50D}"}</Btn></div>
    {!incomeValid&&fin.income===""&&<p style={{textAlign:"center",fontSize:11,color:P.gray,marginTop:8}}>Income is required for affordability analysis</p>}
  </Scroll></Phone>);
  }

  /* ═══ STEP 3: LOADING ═══ */
  if(step===3)return(<Phone><div style={{flex:1,display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",padding:32,textAlign:"center"}}>
    <div style={{position:"relative",width:80,height:80,marginBottom:20}}><div style={{width:80,height:80,borderRadius:"50%",border:`4px solid ${P.lgray}`,borderTopColor:P.mintD,animation:"spin 1s linear infinite"}}/><span style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",fontSize:28}}>{"\u{1F697}"}</span></div>
    <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    <div style={{width:"100%",maxWidth:260,marginBottom:16}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><span style={{fontSize:12,fontWeight:600,color:P.char}}>{progress>=100?"Done!":"Analyzing..."}</span><span style={{fontSize:12,fontWeight:600,color:P.mintD}}>{Math.round(progress)}%</span></div>
      <div style={{width:"100%",height:10,background:P.lgray,borderRadius:5,overflow:"hidden"}}><div style={{width:`${progress}%`,height:"100%",borderRadius:5,transition:"width 0.4s ease-out",background:`linear-gradient(90deg,${P.mintD},${P.lavD})`}}/></div>
      <p style={{margin:"6px 0 0",fontSize:11,color:P.gray}}>{progress<100?`Estimated ~${estSec}s — searching live data`:"Preparing results..."}</p>
    </div>
    <p style={{margin:0,fontSize:13,color:P.gray,lineHeight:1.5,minHeight:40}}>{tips[tipIdx]}</p>
    {err&&(<div style={{marginTop:16}}><p style={{color:P.peachD,fontSize:13,marginBottom:12}}>Hit a speed bump!</p><Btn onClick={()=>{setErr(null);setProgress(0);doAnalysis();}} small>Retry {"\u{1F504}"}</Btn><div style={{marginTop:8}}><Btn onClick={()=>setStep(2)} small color={P.lgray} tc={P.char}>← Edit Details</Btn></div></div>)}
  </div></Phone>);

  /* ═══ STEP 4: PAYMENTS ═══ */
  if(step===4&&results){const r=results,p=r.payments||{},s=r.seventyTwoMonth||{};return(
    <Phone bottomNav={tabBar}><div style={{padding:"8px 20px 0"}}><h2 style={{margin:"4px 0 2px",fontSize:20,fontWeight:700,color:P.char}}>Payment Reality Check {"\u{1F9EE}"}</h2><p style={{margin:"0 0 2px",fontSize:13,fontWeight:600,color:P.char}}>{r.targetCar?.name}</p><p style={{margin:"0 0 6px",fontSize:12,color:P.gray}}>{!car.msrp&&r.targetCar?.msrp?`Market price: ${$(r.targetCar.msrp)} (looked up \u2728)`:`MSRP: ${$(r.targetCar?.msrp||car.msrp)}`}</p></div><Scroll>

      {r.tradeIn?.estimatedKBB&&(<Card bg={P.lav+"33"} style={{marginBottom:10,border:`1.5px solid ${P.lav}`}}>
        <p style={{margin:"0 0 8px",fontSize:14,fontWeight:700,color:P.char}}>{"\u{1F699}"} Your Trade-In</p>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{fontSize:13,color:P.gray}}>Est. KBB Value</span><span style={{fontSize:14,fontWeight:700,color:P.mintD}}>{$(r.tradeIn.estimatedKBB)}</span></div>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{fontSize:13,color:P.gray}}>Dealer Will Likely Offer</span><span style={{fontSize:14,fontWeight:700,color:P.peachD}}>{$(r.tradeIn.estimatedDealerOffer)}</span></div>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><span style={{fontSize:13,color:P.gray}}>Gap You're Giving Up</span><span style={{fontSize:14,fontWeight:700,color:P.peachD}}>{$(r.tradeIn.difference)}</span></div>
        <p style={{margin:0,fontSize:12,color:P.gray,fontStyle:"italic"}}>{r.tradeIn.tip}</p>
      </Card>)}

      <p style={{margin:"0 0 2px",fontSize:14,fontWeight:700,color:P.char}}>60-Month (5-Year) Loan</p>
      <p style={{margin:"0 0 8px",fontSize:12,color:P.gray}}>Financing {$(C.loan)}</p>

      {[{k:"good",l:"Good Credit",e:"\u{1F7E2}",c:P.mint},{k:"average",l:"Average Credit",e:"\u{1F7E1}",c:P.yellow},{k:"bad",l:"Bad Credit",e:"\u{1F534}",c:P.peach}].map(t=>(<Card key={t.k} bg={t.c+"33"} style={{marginBottom:8,border:`1.5px solid ${t.c}`}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><p style={{margin:0,fontSize:13,fontWeight:600,color:P.char}}>{t.e} {t.l} ({p[t.k]?.rate}%)</p><p style={{margin:"2px 0 0",fontSize:11,color:P.gray}}>Total interest: {$(p[t.k]?.totalInterest)}</p></div><div style={{textAlign:"right"}}><p style={{margin:0,fontSize:22,fontWeight:700,color:P.char}}>{$(p[t.k]?.monthly)}</p><p style={{margin:0,fontSize:10,color:P.gray}}>/month × 60</p></div></div></Card>))}

      {/* FIX #4a: Affordability — loan payment vs take-home */}
      {C.pctPaymentVsTake>0&&(<>
        <Gauge pct={C.pctPaymentVsTake} label="Loan payment vs. take-home pay" subtitle={`${$(C.mo60good)}/mo payment ÷ ${$(C.takeMo)}/mo take-home`}/>
        <Tip icon={"\u{1F4D6}"} color={P.sky}><strong>The 35% Reality Check</strong> from Fintentional: If ALL transportation costs exceed 35% of one person's take-home pay, you're likely car-rich and cash-poor. This gauge shows just the loan payment — the True Cost tab shows the full picture.</Tip>
      </>)}

      {/* 72-MONTH TRAP — all client-side calcs */}
      <div style={{background:`linear-gradient(135deg,${P.peach}44,${P.rose}44)`,borderRadius:16,padding:14,marginTop:8,border:`2px solid ${P.peach}`}}>
        <p style={{margin:"0 0 6px",fontSize:15,fontWeight:700,color:P.char}}>{"\u26A0\uFE0F"} The 72-Month Trap</p>
        <p style={{margin:"0 0 8px",fontSize:12,color:P.gray}}>Stretching to 6 years instead of 5:</p>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{fontSize:13,color:P.gray}}>72-month payment (6.2%)</span><span style={{fontSize:14,fontWeight:700,color:P.char}}>{$(C.mo72good)}/mo</span></div>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{fontSize:13,color:P.gray}}>Looks like you "save"</span><span style={{fontSize:14,fontWeight:700,color:P.gray}}>{$(C.mo60good-C.mo72good)}/mo</span></div>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{fontSize:13,color:P.peachD,fontWeight:600}}>But you pay MORE in interest</span><span style={{fontSize:14,fontWeight:700,color:P.peachD}}>+{$(C.extraInt72)}</span></div>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{fontSize:13,color:P.gray}}>60-mo total interest</span><span style={{fontSize:13,fontWeight:600,color:P.gray}}>{$(C.int60good)}</span></div>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}><span style={{fontSize:13,color:P.gray}}>72-mo total interest</span><span style={{fontSize:13,fontWeight:600,color:P.peachD}}>{$(C.int72good)}</span></div>
        {s.underwaterMonths&&<div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}><span style={{fontSize:13,color:P.peachD,fontWeight:600}}>Months "underwater" {"\u{1FAE7}"}</span><span style={{fontSize:14,fontWeight:700,color:P.peachD}}>~{s.underwaterMonths} months</span></div>}
        <p style={{margin:"0 0 8px",fontSize:12,color:P.char,fontStyle:"italic",lineHeight:1.5}}>{s.roast}</p>
        <Tip icon={"\u{1F4D6}"} color={P.peach}><strong>Why this matters:</strong> Cars only go down in value. A 72-month loan means you owe more than the car is worth for most of the loan — you're paying interest on something that's shrinking. That lower payment costs you an extra <strong>{$(C.extraInt72)}</strong>.</Tip>
      </div>
    </Scroll></Phone>
  );}

  /* ═══ STEP 5: ADD-ONS ═══ */
  if(step===5&&results){const addons=results.dealerAddOns||[];const vc={skip:P.peach,maybe:P.yellow,worth_it:P.mint};const vl={skip:"Hard Pass \u{1F645}",maybe:"Maybe... \u{1F914}",worth_it:"Worth It \u2705"};const totalD=addons.reduce((s,a)=>s+n$(a.dealerPrice),0);const totalR=addons.reduce((s,a)=>s+n$(a.realValue),0);return(
    <Phone bottomNav={tabBar}><div style={{padding:"8px 20px 0"}}><h2 style={{margin:"4px 0 2px",fontSize:20,fontWeight:700,color:P.char}}>The F&I Office Gauntlet {"\u{1F6E1}\uFE0F"}</h2><p style={{margin:"0 0 6px",fontSize:12,color:P.gray}}>Where dealers recover margin — one "only $30/mo" at a time</p></div><Scroll>
      <Tip icon={"\u{1F4D6}"} color={P.yellow}><strong>From the book:</strong> "$30/month over 72 months is $2,160. For products that often pay out less than they cost."</Tip>
      <Card bg={P.peach+"33"} style={{marginBottom:12,border:`1.5px solid ${P.peach}`}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><p style={{margin:0,fontSize:13,fontWeight:600,color:P.char}}>If you said yes to everything:</p><p style={{margin:"2px 0 0",fontSize:11,color:P.gray}}>Actual value of all add-ons</p></div><div style={{textAlign:"right"}}><p style={{margin:0,fontSize:20,fontWeight:700,color:P.peachD}}>{$(totalD)}</p><p style={{margin:0,fontSize:13,fontWeight:600,color:P.mintD}}>~{$(totalR)} real value</p></div></div></Card>
      {addons.map((a,i)=>{const c=vc[a.verdict]||P.lgray;return(<Card key={i} bg={P.white} style={{marginBottom:8,border:`1.5px solid ${c}`}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}><div style={{display:"flex",alignItems:"center",gap:6,flex:1}}><span style={{fontSize:18}}>{a.emoji}</span><div><p style={{margin:0,fontSize:14,fontWeight:700,color:P.char}}>{a.name}</p><Tag color={c}>{vl[a.verdict]||a.verdict}</Tag></div></div><div style={{textAlign:"right",flexShrink:0}}><p style={{margin:0,fontSize:15,fontWeight:700,color:P.peachD}}>{$(a.dealerPrice)}</p><p style={{margin:0,fontSize:11,color:P.gray}}>Worth ~{$(a.realValue)}</p></div></div><p style={{margin:0,fontSize:12,color:P.gray,lineHeight:1.5,fontStyle:"italic"}}>{a.explanation}</p></Card>);})}
      <Tip icon={"\u{1F4A1}"} color={P.sky}><strong>Pro move:</strong> Extended warranties can be bought later from third parties for much less. Stash $50-75/mo in a "car repair" fund instead.</Tip>
    </Scroll></Phone>
  );}

  /* ═══ STEP 6: ALTERNATIVES ═══ */
  if(step===6&&results){const alts=results.alternatives||[];return(
    <Phone bottomNav={tabBar}><div style={{padding:"8px 20px 0"}}><h2 style={{margin:"4px 0 2px",fontSize:20,fontWeight:700,color:P.char}}>Smarter Picks {"\u{1F3AF}"}</h2><p style={{margin:"0 0 6px",fontSize:12,color:P.gray}}>Same vibes, better math</p></div><Scroll>
      <Tip icon={"\u{1F4A1}"} color={P.sky}>One strategic move beats years of penny-pinching. A smarter car pick saves more than years of skipping lattes.</Tip>
      {alts.map((a,i)=>(<Card key={i} style={{marginBottom:10,border:i===2?`2px solid ${P.mintD}`:`1.5px solid ${P.lgray}`,background:i===2?P.mint+"22":P.white}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}><div style={{flex:1,paddingRight:8}}><Tag color={i===0?P.sky:i===1?P.yellow:P.mint}>{a.tag}</Tag><p style={{margin:"6px 0 0",fontSize:14,fontWeight:700,color:P.char}}>{a.name}</p></div><div style={{textAlign:"right",flexShrink:0}}><p style={{margin:0,fontSize:18,fontWeight:700,color:P.char}}>{$(a.price)}</p><p style={{margin:"2px 0 0",fontSize:11,fontWeight:600,color:P.mintD}}>Save {$(a.savings)}</p></div></div><p style={{margin:"0 0 6px",fontSize:12,color:P.gray,lineHeight:1.5}}>{a.whyBetter}</p><div style={{background:P.cream,borderRadius:10,padding:"8px 12px",display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontSize:12,color:P.gray}}>Monthly (60mo, good credit)</span><span style={{fontSize:15,fontWeight:700,color:P.char}}>{$(a.monthlyPayment)}/mo</span></div></Card>))}
    </Scroll></Phone>
  );}

  /* ═══ STEP 7: TRUE COST ═══ */
  if(step===7&&results){const tc=results.trueCost||{},tg=tc.target||{},al=tc.bestAlternative||{};
    const Row=({l,t,a})=>(<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"6px 0",borderBottom:`1px solid ${P.lgray}22`}}><span style={{fontSize:12,color:P.gray,flex:1}}>{l}</span><span style={{fontSize:13,fontWeight:600,color:P.peachD,width:75,textAlign:"right"}}>{$(t)}</span><span style={{fontSize:13,fontWeight:600,color:P.mintD,width:75,textAlign:"right"}}>{$(a)}</span></div>);
    return(
    <Phone bottomNav={tabBar}><div style={{padding:"8px 20px 0"}}><h2 style={{margin:"4px 0 2px",fontSize:20,fontWeight:700,color:P.char}}>True Cost of Ownership {"\u{1F4B8}"}</h2><p style={{margin:"0 0 6px",fontSize:12,color:P.gray}}>What you actually pay — not just what the dealer quotes</p></div><Scroll>

      {/* FIX #2: Monthly reality — dealer quote vs actual */}
      <Card bg={P.peach+"22"} style={{marginBottom:12,border:`1.5px solid ${P.peach}`}}>
        <p style={{margin:"0 0 8px",fontSize:14,fontWeight:700,color:P.char}}>{"\u{1F4F1}"} What the Dealer Tells You vs. Reality</p>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{fontSize:13,color:P.gray}}>Dealer's "monthly payment"</span><span style={{fontSize:14,fontWeight:700,color:P.char}}>{$(C.mo60good)}/mo</span></div>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:4,paddingLeft:8}}><span style={{fontSize:12,color:P.gray}}>+ Insurance</span><span style={{fontSize:12,fontWeight:500,color:P.gray}}>+{$(Math.round(n$(tg.annualInsurance)/12))}</span></div>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:4,paddingLeft:8}}><span style={{fontSize:12,color:P.gray}}>+ Gas/Fuel</span><span style={{fontSize:12,fontWeight:500,color:P.gray}}>+{$(Math.round(n$(tg.annualGas)/12))}</span></div>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:4,paddingLeft:8}}><span style={{fontSize:12,color:P.gray}}>+ Maintenance</span><span style={{fontSize:12,fontWeight:500,color:P.gray}}>+{$(Math.round(n$(tg.annualMaintenance)/12))}</span></div>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:4,paddingLeft:8}}><span style={{fontSize:12,color:P.gray}}>+ Depreciation</span><span style={{fontSize:12,fontWeight:500,color:P.gray}}>+{$(Math.round(n$(tg.annualDepreciation)/12))}</span></div>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:4,paddingLeft:8}}><span style={{fontSize:12,color:P.gray}}>+ Parking</span><span style={{fontSize:12,fontWeight:500,color:P.gray}}>+{$(Math.round(n$(tg.annualParking)/12))}</span></div>
        <div style={{display:"flex",justifyContent:"space-between",padding:"8px 0 0",marginTop:4,borderTop:`2px solid ${P.peachD}44`}}><span style={{fontSize:14,fontWeight:700,color:P.peachD}}>Your ACTUAL monthly cost</span><span style={{fontSize:18,fontWeight:700,color:P.peachD}}>{$(C.tgMonthlyAll)}/mo</span></div>
        <div style={{display:"flex",justifyContent:"space-between",marginTop:6,background:P.mint+"22",borderRadius:10,padding:"6px 10px"}}><span style={{fontSize:13,color:P.mintD,fontWeight:600}}>Smart pick actual monthly</span><span style={{fontSize:14,fontWeight:700,color:P.mintD}}>{$(C.alMonthlyAll)}/mo</span></div>
        {C.tgMonthlyAll>C.alMonthlyAll&&<p style={{margin:"6px 0 0",fontSize:11,color:P.mintD,fontWeight:600,textAlign:"center"}}>That's {$(C.tgMonthlyAll-C.alMonthlyAll)}/mo back in your pocket with the smart pick</p>}
      </Card>

      <Tip icon={"\u{1F4D6}"} color={P.yellow}>"You're not buying a car. You're renting mobility. The question is how much that rental costs — and what else you could do with the difference." — Fintentional</Tip>

      <Card style={{marginBottom:12}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}><span style={{fontSize:12,fontWeight:700,color:P.gray}}>Annual Breakdown</span><div style={{display:"flex"}}><span style={{fontSize:11,fontWeight:700,color:P.peachD,width:75,textAlign:"right"}}>Your Pick</span><span style={{fontSize:11,fontWeight:700,color:P.mintD,width:75,textAlign:"right"}}>Smart Pick</span></div></div>
        <Row l={"\u{1F6E1}\uFE0F Insurance"} t={tg.annualInsurance} a={al.annualInsurance}/>
        <Row l={"\u26FD Gas/Fuel"} t={tg.annualGas} a={al.annualGas}/>
        <Row l={"\u{1F527} Maintenance"} t={tg.annualMaintenance} a={al.annualMaintenance}/>
        <Row l={"\u{1F4C9} Depreciation"} t={tg.annualDepreciation} a={al.annualDepreciation}/>
        <Row l={"\u{1F17F}\uFE0F Parking"} t={tg.annualParking} a={al.annualParking}/>
        <div style={{display:"flex",justifyContent:"space-between",padding:"10px 0 0",marginTop:6,borderTop:`2px solid ${P.char}22`}}><span style={{fontSize:14,fontWeight:700,color:P.char}}>Annual Total</span><div style={{display:"flex"}}><span style={{fontSize:14,fontWeight:700,color:P.peachD,width:75,textAlign:"right"}}>{$(tg.annualTotal)}</span><span style={{fontSize:14,fontWeight:700,color:P.mintD,width:75,textAlign:"right"}}>{$(al.annualTotal)}</span></div></div>
      </Card>

      {/* FIX #4b: ALL-IN monthly cost vs take-home (different from Payments tab which shows just the loan payment) */}
      {C.pctAllInVsTake>0&&(<>
        <Gauge pct={C.pctAllInVsTake} label="ALL-IN car cost vs. take-home pay" subtitle={`${$(C.tgMonthlyAll)}/mo total ÷ ${$(C.takeMo)}/mo take-home`}/>
        <Tip icon={"\u{1F4A1}"} color={P.sky}><strong>The Payment Multiplier:</strong> Your monthly loan payment is roughly half your true monthly cost. A {$(C.mo60good)} payment actually means ~{$(C.tgMonthlyAll)}/mo when you add everything up.</Tip>
      </>)}

      {/* FIX #5: 5yr totals computed client-side from true cost of ownership */}
      <Card bg={P.mint+"33"} style={{marginBottom:12,border:`1.5px solid ${P.mint}`}}><div style={{textAlign:"center"}}>
        <p style={{margin:"0 0 4px",fontSize:13,color:P.gray}}>5-Year True Cost (payments + ownership)</p>
        <div style={{display:"flex",justifyContent:"center",gap:24,margin:"8px 0"}}><div><p style={{margin:0,fontSize:12,color:P.peachD,fontWeight:600}}>Your Pick</p><p style={{margin:0,fontSize:22,fontWeight:700,color:P.peachD}}>{$(C.tgFiveYrTotal)}</p></div><div style={{fontSize:24,alignSelf:"center"}}>→</div><div><p style={{margin:0,fontSize:12,color:P.mintD,fontWeight:600}}>Smart Pick</p><p style={{margin:0,fontSize:22,fontWeight:700,color:P.mintD}}>{$(C.alFiveYrTotal)}</p></div></div>
        <Tag color={P.mint}>5-Year Savings: {$(C.fiveYrSave)}</Tag>
      </div></Card>
    </Scroll></Phone>
  );}

  /* ═══ STEP 8: LIFETIME ═══ */
  if(step===8&&results){const lm=results.lifetimeMath||{};return(
    <Phone bottomNav={tabBar}><div style={{padding:"8px 20px 0"}}><h2 style={{margin:"4px 0 2px",fontSize:20,fontWeight:700,color:P.char}}>The Lifetime Math {"\u{1F52E}"}</h2><p style={{margin:"0 0 6px",fontSize:12,color:P.gray}}>Based on total cost of ownership — not just sticker price</p></div><Scroll>
      <Card bg={`linear-gradient(135deg,${P.lav}33,${P.mint}33)`} style={{marginBottom:12,border:`1.5px solid ${P.lav}66`}}>
        <div style={{textAlign:"center"}}>
          <p style={{margin:"0 0 4px",fontSize:13,color:P.gray}}>5-year true cost savings per car</p>
          <p style={{margin:"0 0 2px",fontSize:11,color:P.gray}}>(payments + insurance + gas + maintenance + depreciation)</p>
          <p style={{margin:"0 0 12px",fontSize:28,fontWeight:700,color:P.char}}>{$(C.perCarSave)}</p>
          <div style={{display:"flex",justifyContent:"center",alignItems:"center",gap:8,margin:"8px 0"}}><span style={{fontSize:28}}>×</span><div style={{background:P.yellow+"66",borderRadius:10,padding:"8px 16px"}}><p style={{margin:0,fontSize:20,fontWeight:700,color:P.char}}>9</p><p style={{margin:0,fontSize:10,color:P.gray}}>cars in a lifetime</p></div></div>
          <div style={{margin:"12px 0",height:2,background:P.lgray}}/>
          <p style={{margin:"0 0 4px",fontSize:13,color:P.gray}}>Raw savings (before investing)</p>
          <p style={{margin:"0 0 16px",fontSize:26,fontWeight:700,color:P.char}}>{$(C.rawTotal)}</p>
          <div style={{background:P.mint+"44",borderRadius:14,padding:12,border:`1.5px solid ${P.mintD}`}}><p style={{margin:"0 0 4px",fontSize:12,color:P.gray}}>Invested at 7% with staggered compounding</p><p style={{margin:0,fontSize:34,fontWeight:700,color:P.mintD,fontFamily:"'Fredoka',sans-serif"}}>{$(C.staggered)}</p></div>
        </div>
      </Card>
      <Card bg={P.sky+"33"} style={{marginBottom:12,border:`1px solid ${P.sky}`}}><p style={{margin:"0 0 6px",fontSize:13,fontWeight:700,color:P.char}}>How we calculated this</p><p style={{margin:0,fontSize:12,color:P.gray,lineHeight:1.6}}>You'll buy ~9 cars over ~45 years. Each time, choosing the smarter alternative saves {$(C.perCarSave)} over 5 years of ownership — that's <strong>total cost of ownership</strong> (loan payments + insurance + gas + maintenance + depreciation), not just the sticker price difference. Savings from car #1 compound for 40 years at 7%. Car #2 for 35 years. Down to car #9 with 0 years. Money saved earlier is worth far more.</p></Card>
      <Card bg={P.yellow+"44"} style={{marginBottom:12}}><p style={{margin:0,fontSize:14,fontWeight:600,color:P.char,lineHeight:1.6,textAlign:"center"}}>{lm.funnyComparison}</p></Card>
      <Tip icon={"\u{1F4D6}"} color={P.sky}><strong>One fewer car. Six figures in wealth.</strong> Keep each car one year longer, buy 1-2 fewer over your life, and the math gets even better. — Fintentional</Tip>
      <Tip icon={"\u{1F914}"} color={P.rose}>This isn't about deprivation. If the car brings you joy and fits your bigger goals, go for it. But make it a conscious choice — not a default. That's the difference between drifting and deciding.</Tip>
    </Scroll></Phone>
  );}

  /* ═══ STEP 9: SHARE ═══ */
  if(step===9&&results){const alts=results.alternatives||[];const fp=alts[2];
    // FIX #6: Each option gets its OWN quote that only references that car
    const targetName=results.targetCar?.name||`${car.year} ${car.make} ${car.model}`;
    const smartName=fp?.name||"the smarter pick";
    const opts=[
      {id:"target",name:targetName,price:$(results.targetCar?.msrp||car.msrp),
        quote:results.quotes?.splurge||`I ran the numbers on my ${targetName}. I saw the truth. Getting it anyway.`,
        emoji:"\u{1F525}",c:P.peach},
      ...(fp?[{id:"smart",name:smartName,price:$(fp.price),
        quote:results.quotes?.bargain||`Went with the ${smartName}. Same vibes, way smarter math. My future self says thanks.`,
        emoji:"\u{1F9E0}",c:P.mint}]:[]),
    ];
    const pick=opts.find(o=>o.id===chosen);
    return(
    <Phone bottomNav={tabBar}><div style={{padding:"8px 20px 0"}}><h2 style={{margin:"4px 0 2px",fontSize:20,fontWeight:700,color:P.char,textAlign:"center"}}>What's Your Move? {"\u{1F3AF}"}</h2><p style={{margin:"0 0 6px",fontSize:12,color:P.gray,textAlign:"center"}}>No judgment. Just math and vibes.</p></div><Scroll>
      {opts.map(o=>(<button key={o.id} onClick={()=>setChosen(o.id)} style={{width:"100%",background:chosen===o.id?o.c+"44":P.white,border:`2.5px solid ${chosen===o.id?o.c:P.lgray}`,borderRadius:18,padding:16,marginBottom:10,cursor:"pointer",textAlign:"left",fontFamily:"'Quicksand',sans-serif",transition:"all .25s",position:"relative",overflow:"hidden"}}>
        {chosen===o.id&&<div style={{position:"absolute",top:10,right:12,fontSize:20}}>{"\u2714"}</div>}
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}><span style={{fontSize:22}}>{o.emoji}</span><span style={{fontSize:15,fontWeight:700,color:P.char}}>{o.name}</span></div>
        <p style={{margin:"0 0 6px",fontSize:20,fontWeight:700,color:P.char}}>{o.price}</p>
        <p style={{margin:0,fontSize:12,color:P.gray,fontStyle:"italic",lineHeight:1.5}}>"{o.quote}"</p>
      </button>))}
      {chosen&&pick&&(
        <div style={{background:`linear-gradient(135deg,${P.lav}33,${P.mint}33)`,borderRadius:18,padding:16,marginTop:8,border:`1.5px solid ${P.lav}44`}}>
          <div style={{background:P.white,borderRadius:14,padding:16,boxShadow:"0 4px 20px rgba(0,0,0,.08)",marginBottom:14}}>
            <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:10}}><span style={{fontSize:16}}>{"\u{1F697}"}</span><span style={{fontFamily:"'Fredoka',sans-serif",fontSize:18,fontWeight:600,color:P.char}}>Fintentional Rides</span></div>
            <p style={{margin:"0 0 4px",fontSize:14,fontWeight:700,color:P.char}}>I chose: {pick.name} {pick.emoji}</p>
            <p style={{margin:"0 0 8px",fontSize:12,color:P.gray,fontStyle:"italic",lineHeight:1.5}}>"{pick.quote}"</p>
            {chosen==="smart"&&(<div style={{background:P.mint+"33",borderRadius:10,padding:"8px 12px"}}><p style={{margin:0,fontSize:11,fontWeight:600,color:P.mintD}}>Lifetime impact: {$(C.staggered)} (invested at 7%) {"\u{1F4C8}"}</p></div>)}
            {chosen==="target"&&(<div style={{background:P.peach+"33",borderRadius:10,padding:"8px 12px"}}><p style={{margin:0,fontSize:11,fontWeight:600,color:P.peachD}}>I did the math. I saw the truth. I'm getting it anyway. {"\u{1F485}"}</p></div>)}
            <p style={{margin:"8px 0 0",fontSize:10,color:P.gray}}>Calculate yours → fintentionalrides.com</p>
          </div>
          <p style={{margin:"0 0 10px",fontSize:13,fontWeight:600,color:P.char,textAlign:"center"}}>Share your decision</p>
          <div style={{display:"flex",justifyContent:"center",gap:10,flexWrap:"wrap"}}>
            <SBtn label="X" color="#000" icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>} onClick={()=>{}}/>
            <SBtn label="Facebook" color="#1877F2" icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>} onClick={()=>{}}/>
            <SBtn label="LinkedIn" color="#0A66C2" icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>} onClick={()=>{}}/>
            <SBtn label="iMessage" color="#34C759" icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>} onClick={()=>{}}/>
            <SBtn label="Copy" color={P.gray} icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>} onClick={()=>{}}/>
          </div>
        </div>
      )}
      <div style={{marginTop:16}}><Btn onClick={()=>{setStep(0);setResults(null);setChosen(null);setCar({make:"",model:"",year:"2025",isNew:"new",msrp:""});setFin({down:"",income:"",hasTrade:false});}} color={P.lav} tc={P.char}>Calculate Another Car {"\u{1F504}"}</Btn></div>
      <p style={{textAlign:"center",fontSize:11,color:P.gray,marginTop:16,lineHeight:1.5}}>Built with the <strong>Fintentional Framework</strong><br/>The goal isn't the cheapest car. It's the car that leaves room for everything else you're trying to build. {"\u{1F697}\u{1F4A8}"}</p>
    </Scroll></Phone>
  );}

  return <Phone><div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center"}}><Btn onClick={()=>setStep(0)}>Start Over</Btn></div></Phone>;
}
