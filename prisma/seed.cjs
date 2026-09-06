/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require("@prisma/client")
const { randomBytes, scryptSync } = require("crypto")

const prisma = new PrismaClient()

const SCRYPT_KEYLEN = 64
const SCRYPT_SALT_BYTES = 16
const SCRYPT_OPTIONS = {
  N: 16384,
  r: 8,
  p: 1,
}

function hashPassword(password) {
  const salt = randomBytes(SCRYPT_SALT_BYTES).toString("hex")
  const derived = scryptSync(
    password,
    salt,
    SCRYPT_KEYLEN,
    SCRYPT_OPTIONS
  ).toString("hex")

  return `scrypt$${salt}$${derived}`
}

async function upsertUser({ email, username, password, role }) {
  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      username,
      password: hashPassword(password),
      displayPassword: password,
      role,
      status: "ACTIVE",
    },
  })

  console.log(`Seeded ${role.toLowerCase()} user: ${user.email}`)
}

async function main() {
  await upsertUser({
    email: "admin@wrl.com",
    username: "admin",
    password: "admin123",
    role: "ADMIN",
  })

  await upsertUser({
    email: "journalist@wrl.com",
    username: "journalist",
    password: "journalist123",
    role: "JOURNALIST",
  })

  await upsertUser({
    email: "prayer@wrl.com",
    username: "prayer",
    password: "prayer123",
    role: "PRAYER",
  })

  const programSettings = {
    id: "default",
    heading: "Updated Wantok Radio Light Program Guide",
    subheading: "Confirmed on-air programs and broadcast times in PNG Time, UTC+10.",
    timeSlotHeading: "Day / Time",
    programHeading: "Program",
    contentFocusHeading: "Notes",
  }

  await prisma.programListSettings.upsert({
    where: { id: programSettings.id },
    update: programSettings,
    create: programSettings,
  })
  console.log("Seeded program guide settings")

  const radioPrograms = [
    ["prog_weekday_0030_focus_family", "Mon-Fri | 12:30 AM", "Focus on the Family", "Early morning family teaching."],
    ["prog_weekday_0430_back_bible", "Mon-Fri | 4:30 AM", "Back to the Bible", "Early morning Bible teaching."],
    ["prog_weekday_0540_morning_devotion", "Mon-Fri | 5:40 AM", "Morning Light Devotion", "Morning Light Show devotion."],
    ["prog_weekday_0600_nbc_news", "Mon-Fri | 6:00 AM", "NBC News", "Morning news relay."],
    ["prog_weekday_0630_focus_family_repeat", "Mon-Fri | 6:30 AM", "Focus on the Family", "Repeat broadcast."],
    ["prog_weekday_0700_nbc_news_relay", "Mon-Fri | 7:00 AM", "NBC News Relay", "National news relay."],
    ["prog_weekday_0715_just_thinking", "Mon-Fri | 7:15 AM", "Just Thinking - Dr Ravi Zacharias", "Christian teaching."],
    ["prog_monday_0730_hope_bars", "Monday | 7:30 AM", "Hope Behind Bars", "New live program hosted by Ps Simon; replaces Radio Play."],
    ["prog_tuefri_0730_praying_nation", "Tue-Fri | 7:30 AM", "Praying for the Nation", "Prayer and national focus."],
    ["prog_weekday_0800_back_bible", "Mon-Fri | 8:00 AM", "Back to the Bible", "Bible teaching."],
    ["prog_weekday_0845_krai_meri", "Mon, Wed, Fri | 8:45 AM", "Krai Bilong Meri", "Local PNG program."],
    ["prog_tuethu_0845_kirapim", "Tue & Thu | 8:45 AM", "Kirapim Gutpela Sidaun", "Local PNG program."],
    ["prog_thursday_0900_hope_bars", "Thursday | 9:00-10:00 AM", "Hope Behind Bars", "New ex-inmates live in studio program."],
    ["prog_weekday_0910_lhm", "Mon-Fri | 9:10 AM", "Light House Messenger", "Daily encouragement."],
    ["prog_wednesday_0925_health", "Wednesday | 9:25 AM", "Health Nuggets", "Confirmed on air."],
    ["prog_friday_0925_stori", "Friday | 9:25 AM", "Stori Bilong Mi", "Local testimony program."],
    ["prog_weekday_1015_guidelines", "Mon-Fri | 10:15 AM", "Guidelines for Living", "Midday teaching."],
    ["prog_weekday_1110_everyday", "Mon-Fri | 11:10 AM", "Enjoying Everyday Living", "Christian living."],
    ["prog_weekday_1140_belo", "Mon-Fri | 11:40 AM", "Belo Devotions", "Midday devotion."],
    ["prog_weekday_1200_nbc_midday", "Mon-Fri | 12:00 PM", "NBC Midday News", "Midday news."],
    ["prog_weekday_1210_lunch_dedication", "Mon-Fri | 12:10 PM", "Lunch Hour Dedication", "Listener dedication program."],
    ["prog_weekday_1410_lhm", "Mon-Fri | 2:10 PM", "Light House Messenger", "Afternoon encouragement."],
    ["prog_weekday_1430_family_life", "Mon-Fri | 2:30 PM", "Family Life Today", "Family teaching."],
    ["prog_weekday_1515_keys_kids", "Mon-Fri | 3:15 PM", "Keys for Kids", "Children's Hour."],
    ["prog_weekday_1530_story_hour", "Mon-Fri | 3:30 PM", "Your Story Hour", "Children's Hour."],
    ["prog_weekday_1630_odyssey", "Mon-Fri | 4:30 PM", "Adventures in Odyssey", "Drive to Destiny."],
    ["prog_monday_1700_leading_way", "Monday | 5:00 PM", "Leading the Way", "Drive to Destiny."],
    ["prog_thursday_1700_choice_listener", "Thursday | 5:00 PM", "Choice Bilong Listener", "Listener choice program."],
    ["prog_weekday_1730_unshackled", "Tue-Fri | 5:30 PM", "Unshackled", "Christian testimony drama."],
    ["prog_weekday_1830_fresh_touch", "Mon-Fri | 6:30 PM", "Fresh Touch", "Night Light Show."],
    ["prog_weekday_1900_nbc_news", "Mon-Fri | 7:00 PM", "NBC News", "Evening news."],
    ["prog_thursday_1930_heralds", "Thursday | 7:30 PM", "Heralds of Hope", "New program."],
    ["prog_otherdays_1930_focus_family", "Mon-Wed, Fri | 7:30 PM", "Focus on the Family", "Evening family program."],
    ["prog_weekday_2000_lhm", "Mon-Fri | 8:00 PM", "Light House Messenger", "Evening encouragement."],
    ["prog_weekday_2010_chapel", "Mon-Fri | 8:10 PM", "Chapel in the Air", "Evening teaching."],
    ["prog_weekday_2100_lmpthink", "Mon-Fri | 9:00 PM", "Let My People Think", "Now on air."],
    ["prog_weekday_2145_just_thinking", "Mon-Fri | 9:45 PM", "Just Thinking", "Confirmed on air."],
    ["prog_weekday_2210_back_bible", "Mon-Fri | 10:10 PM", "Back to the Bible", "Late night Bible teaching."],
    ["prog_saturday_0700_nbc_news", "Saturday | 7:00 AM", "NBC News", "Weekend news."],
    ["prog_saturday_0715_gaither", "Saturday | 7:15 AM", "Bill Gaither Home Coming Radio", "Confirmed on air."],
    ["prog_saturday_0810_lhm", "Saturday | 8:10 AM", "Light House Messenger", "Weekend encouragement."],
    ["prog_saturday_1000_hope_bars", "Saturday | 10:00 AM", "Hope Behind Bars", "New live program with ex-prisoners."],
    ["prog_saturday_1200_nbc_news", "Saturday | 12:00 PM", "NBC News", "Weekend news."],
    ["prog_saturday_1310_story_song", "Saturday | 1:10 PM", "Story Behind the Song", "Confirmed on air."],
    ["prog_saturday_1410_lhm", "Saturday | 2:10 PM", "Light House Messenger", "Weekend encouragement."],
    ["prog_saturday_1515_women_hope", "Saturday | 3:15 PM", "Women of Hope", "Women's encouragement."],
    ["prog_saturday_1615_lmpthink", "Saturday | 4:15 PM", "Let My People Think", "Confirmed on air."],
    ["prog_saturday_1900_nbc_news", "Saturday | 7:00 PM", "NBC News", "Weekend news."],
    ["prog_saturday_1920_heritage", "Saturday | 7:20 PM", "Heritage and Hope", "Weekend program."],
    ["prog_saturday_2010_lhm", "Saturday | 8:10 PM", "Light House Messenger", "Weekend encouragement."],
    ["prog_saturday_2110_champions", "Saturday | 9:10 PM", "Champions Arise", "Men's encouragement."],
    ["prog_saturday_2210_unshackled", "Saturday | 10:10 PM", "Unshackled", "Christian testimony drama."],
    ["prog_sunday_0700_nbc_news", "Sunday | 7:00 AM", "NBC News", "Sunday news."],
    ["prog_sunday_0720_heritage", "Sunday | 7:20 AM", "Heritage and Hope", "Sunday program."],
    ["prog_sunday_0910_lhm", "Sunday | 9:10 AM", "Light House Messenger", "Sunday encouragement."],
    ["prog_sunday_1100_church", "Sunday | 11:00 AM", "Live Church Broadcast", "Live Sunday worship broadcast."],
    ["prog_sunday_1200_nbc_news", "Sunday | 12:00 PM", "NBC News", "Sunday news."],
    ["prog_sunday_1410_psalms", "Sunday | 2:10 PM", "Psalms 95", "Sunday worship and encouragement."],
    ["prog_sunday_1510_lhm", "Sunday | 3:10 PM", "Light House Messenger", "Sunday encouragement."],
    ["prog_sunday_1610_unshackled", "Sunday | 4:10 PM", "Unshackled", "Christian testimony drama."],
    ["prog_sunday_1710_dayspring", "Sunday | 5:10 PM", "Dayspring", "Sunday encouragement."],
    ["prog_sunday_1900_nbc_news", "Sunday | 7:00 PM", "NBC News", "Sunday news."],
    ["prog_sunday_1915_rmnc", "Sunday | 7:15 PM", "Live RMNC Broadcast", "Live Sunday broadcast."],
    ["prog_sunday_2010_lhm", "Sunday | 8:10 PM", "Light House Messenger", "Sunday encouragement."],
    ["prog_sunday_2030_lmpthink", "Sunday | 8:30 PM", "Let My People Think", "Confirmed on air."],
    ["prog_sunday_2130_leading_way", "Sunday | 9:30 PM", "Leading the Way", "Sunday teaching."],
  ]

  for (const [index, [id, timeSlot, program, contentFocus]] of radioPrograms.entries()) {
    await prisma.radioProgram.upsert({
      where: { id },
      update: { timeSlot, program, contentFocus, sortOrder: index + 1, isHidden: false },
      create: {
        id,
        timeSlot,
        program,
        contentFocus,
        sortOrder: index + 1,
      },
    })
  }
  console.log(`Seeded ${radioPrograms.length} radio program rows`)
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
