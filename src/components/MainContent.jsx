import { useState, useEffect } from "react";
import Grid from "@mui/material/Grid2";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Prayers from "./Prayers";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import axios from "axios";
import moment from "moment";
import "moment/dist/locale/ar";

moment.locale("ar");
export default function MainContent() {
  // STATES
  const [timings, setTimings] = useState({
    Fajr: "06:52",

    Dhuhr: "13:18",
    Asr: "17:31",
    Maghrib: "20:10",
    Isha: "22:11",
  });
  const [nextPrayerIndex, setNextPrayerIndex] = useState(0);
  const [today, setToday] = useState("");

  const [selectedCity, setSelectedCity] = useState({
    displayName: "القاهرة",
    apiName: "Cairo",
  });
  const availableCities = [
    {
      displayName: "القاهرة",
      apiName: "Cairo",
    },
    {
      displayName: "الجيزة",
      apiName: "Giza",
    },
    {
      displayName: "الاسكندرية",
      apiName: "Alexandria",
    },
    {
      displayName: "أسوان",
      apiName: "Aswan",
    },
    {
      displayName: "الأقصر",
      apiName: "Luxor",
    },
    {
      displayName: "سوهاج",
      apiName: "Sohag",
    },
    {
      displayName: "أسيوط",
      apiName: "Assiut",
    },
    {
      displayName: "بني سويف",
      apiName: "BeniSuef",
    },
    {
      displayName: "الفيوم",
      apiName: "Fayoum",
    },
    {
      displayName: "المنيا",
      apiName: "Minya",
    },
    {
      displayName: "البحيرة",
      apiName: "Beheira",
    },
    {
      displayName: "الدقهلية",
      apiName: "Dakahlia",
    },
    {
      displayName: "الشرقية",
      apiName: "Sharqia",
    },
    {
      displayName: "دمياط",
      apiName: "Damietta",
    },
    {
      displayName: "بورسعيد",
      apiName: "PortSaid",
    },
    {
      displayName: "الإسماعيلية",
      apiName: "Ismailia",
    },
    {
      displayName: "السويس",
      apiName: "Suez",
    },
    {
      displayName: "مطروح",
      apiName: "Matruh",
    },
    {
      displayName: "الغربية",
      apiName: "Gharbia",
    },
    {
      displayName: "كفر الشيخ",
      apiName: "KafrElSheikh",
    },
    {
      displayName: "القليوبية",
      apiName: "Qalyubia",
    },
    {
      displayName: "المنوفية",
      apiName: "Monufia",
    },
    {
      displayName: "جنوب سيناء",
      apiName: "SouthSinai",
    },
    {
      displayName: "شمال سيناء",
      apiName: "NorthSinai",
    },
    {
      displayName: "قنا",
      apiName: "Qena",
    },
    {
      displayName: "البحر الأحمر",
      apiName: "RedSea",
    },
    {
      displayName: "الوادي الجديد",
      apiName: "NewValley",
    },
  ];

  const prayersArray = [
    {
      key: "Fajr",
      displayName: "الفجر",
    },
    {
      key: "Dhuhr",
      displayName: "الظهر",
    },
    {
      key: "Asr",
      displayName: "العصر",
    },
    {
      key: "Maghrib",
      displayName: "المغرب",
    },
    {
      key: "Isha",
      displayName: "العشاء",
    },
  ];
  const [remainingTime, setRemainigTime] = useState("");
  const getTimings = async () => {
    const response = await axios.get(
      `https://api.aladhan.com/v1/timingsByCity?city=${selectedCity.apiName}&country=Egypt&method=2`
    );
    setTimings(response.data.data.timings);
  };
  const dateFormat = "Do  MMM / Y | h:mm A";
  useEffect(() => {
    getTimings();
    const t = moment();

    setToday(t.format(dateFormat));
  }, [selectedCity]);

  const handleCityChange = (event) => {
    const cityObject = availableCities.find((city) => {
      return city.apiName == event.target.value;
    });
    setSelectedCity(cityObject);
  };
  useEffect(() => {
    let interval = setInterval(() => {
      setupCounDownTimer();
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [timings]);
  const setupCounDownTimer = () => {
    const momentNow = moment();
    let nextPrayer = 2;
    if (
      momentNow.isAfter(moment(timings["Fajr"], "hh:mm")) &&
      momentNow.isBefore(moment(timings["Dhuhr"], "hh:mm"))
    ) {
      nextPrayer = 1;
    } else if (
      momentNow.isAfter(moment(timings["Dhuhr"], "hh:mm")) &&
      momentNow.isBefore(moment(timings["Asr"], "hh:mm"))
    ) {
      nextPrayer = 2;
    } else if (
      momentNow.isAfter(moment(timings["Asr"], "hh:mm")) &&
      momentNow.isBefore(moment(timings["Maghrib"], "hh:mm"))
    ) {
      nextPrayer = 3;
    } else if (
      momentNow.isAfter(moment(timings["Maghrib"], "hh:mm")) &&
      momentNow.isBefore(moment(timings["Isha"], "hh:mm"))
    ) {
      nextPrayer = 4;
    } else {
      nextPrayer = 0;
    }
    setNextPrayerIndex(nextPrayer);
    const nextPrayerObject = prayersArray[nextPrayer];
    const nextPrayerTimer = timings[nextPrayerObject.key];
    const nextPrayerTimerMoment = moment(nextPrayerTimer, "hh:mm");
    var remainTime = moment(nextPrayerTimer, "hh:mm").diff(momentNow);
    if (remainTime < 0) {
      const midNightDiff = moment("23:59:59", "hh:mm:ss").diff(momentNow);
      const fajrDiff = nextPrayerTimerMoment.diff(
        moment("00:00:00", "hh:mm:ss")
      );
      const totalDiff = midNightDiff + fajrDiff;
      remainTime = totalDiff;
    }
    const durationTime = moment.duration(remainTime);
    setRemainigTime(
      `${durationTime.seconds()} : ${durationTime.minutes()} :${durationTime.hours()} `
    );
  };
  return (
    <>
      <Grid container spacing={70}>
        <Grid xs={6}>
          <div>
            <h2 style={{ fontSize: "27px" }}>{today}</h2>
            <h2 style={{ fontSize: "40px" }}>{selectedCity.displayName}</h2>
          </div>
        </Grid>
        <Grid xs={6}>
          <div>
            <h2 style={{ fontSize: "27px" }}>
              متبقى على صلاة {prayersArray[nextPrayerIndex].displayName}
            </h2>
            <h2 style={{ fontSize: "40px" }}>{remainingTime}</h2>
          </div>
        </Grid>
      </Grid>
      {/* TOP ROW */}
      <Divider style={{ borderColor: "rgb(255 255 255 /20%)" }} />
      {/* PRAYERS CARDS */}
      <Stack
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          marginTop: "50px",
        }}
      >
        <Prayers
          name="الفجر"
          time={timings.Fajr}
          image="https://i.pinimg.com/736x/2d/f1/5f/2df15fc6d8f1ceff04bdd6c11468afad.jpg"
        />
        <Prayers
          name="الظهر"
          time={timings.Dhuhr}
          image="https://i.pinimg.com/736x/cf/2a/6f/cf2a6fd8a2093c0a40ecf69c0781bb27.jpg"
        />
        <Prayers
          name="العصر"
          time={timings.Asr}
          image="https://i.pinimg.com/736x/fb/3a/10/fb3a102c6d6c52b10c666659e366d224.jpg"
        />
        <Prayers
          name="المغرب"
          time={timings.Maghrib}
          image="https://i.pinimg.com/736x/74/86/a7/7486a70b4b62e3a745580d9c0bea6369.jpg"
        />
        <Prayers
          name="العشاء"
          time={timings.Isha}
          image="https://i.pinimg.com/236x/42/62/7e/42627e18a0365c0f8c0dbd5763aba352.jpg"
        />
      </Stack>
      {/* PRAYERS CARDS */}
      {/* SELECT CITY */}
      <Stack
        direction="row"
        style={{ justifyContent: "center", marginTop: "40px", color: "white" }}
      >
        <FormControl style={{ width: "20%", color: "white" }}>
          <InputLabel id="demo-simple-select-label">
            <span style={{ color: "white" }}>المدينة</span>
          </InputLabel>
          <Select
            style={{ color: "white"}}
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            // value={age}
            // label="Age"
            onChange={handleCityChange}
          >
            {availableCities.map((city) => {
              return (
                <MenuItem key={city.apiName} value={city.apiName}>
                  {city.displayName}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </Stack>
      {/* SELECT CITY */}
    </>
  );
}
