import { getDb } from "../api/queries/connection";
import { follows, postLikes, posts, users } from "./schema";

const minutesAgo = (min: number) => new Date(Date.now() - min * 60_000);
const hoursAgo = (h: number) => minutesAgo(h * 60);
const daysAgo = (d: number) => minutesAgo(d * 24 * 60);

async function seed() {
  const db = getDb();
  console.log("Seeding database...");

  // Очистка (idempotent-сид для прототипа)
  await db.delete(postLikes);
  await db.delete(follows);
  await db.delete(posts);
  await db.delete(users);

  await db.insert(users).values([
    { id: "u-aliya", name: "Алия Нурланова", handle: "aliya_n", avatar: "/avatar-aliya.png", bio: "Дизайнер интерфейсов · Алматы ☕️", followers: 248, following: 183 },
    { id: "u-dmitriy", name: "Дмитрий Ким", handle: "dkim_dev", avatar: "/avatar-dmitriy.png", bio: "Фронтенд-разработчик · Астана", followers: 1204, following: 321 },
    { id: "u-saule", name: "Сауле Абдрахманова", handle: "saule_reads", avatar: "/avatar-saule.png", bio: "Книжный блогер. Читаю и делюсь", followers: 3421, following: 210 },
    { id: "u-timur", name: "Тимур Есенов", handle: "timur_runs", avatar: "/avatar-timur.png", bio: "Бег и марафоны. Готовлюсь к Алматы Марафону", followers: 876, following: 154 },
    { id: "u-madina", name: "Мадина Серикова", handle: "madina_art", avatar: "/avatar-madina.png", bio: "Иллюстратор. Орнаменты в современном стиле", followers: 5230, following: 98 },
    { id: "u-arman", name: "Арман Бектасов", handle: "arman_it", avatar: "/avatar-arman.png", bio: "Новости технологий и IT в Казахстане", followers: 8945, following: 412 },
    { id: "u-zhanna", name: "Жанна Оспанова", handle: "zhanna_travel", avatar: "/avatar-zhanna.png", bio: "Тревел-заметки. Казахстан и дальше", followers: 2140, following: 388 },
    { id: "u-yerzhan", name: "Ержан Муратов", handle: "yerzhan_photo", avatar: "/avatar-yerzhan.png", bio: "Фотограф. Плёнка не умирает", followers: 1567, following: 240 },
  ]);

  await db.insert(posts).values([
    { id: "p-01", authorId: "u-dmitriy", text: "Наконец-то переехал на React 19. Actions и useOptimistic — это то, чего не хватало годами. Кто уже пробовал в продакшене? #it #react", createdAt: minutesAgo(15), likes: 34, comments: 7, reposts: 4 },
    { id: "p-02", authorId: "u-saule", text: "Дочитала «Путь Абая». Каждый раз поражаюсь, насколько современно звучат мысли полуторавековой давности. Обязательно к прочтению. #книги", createdAt: minutesAgo(42), likes: 58, comments: 12, reposts: 9 },
    { id: "p-03", authorId: "u-arman", text: "В Алматы открылся новый IT-хаб в Терренкуре. Коворкинги, акселератор и вид на горы из окна. Работать мечтаю! #алматы #it", createdAt: hoursAgo(1), likes: 96, comments: 21, reposts: 15 },
    { id: "p-04", authorId: "u-aliya", text: "Собрала новую дизайн-систему для проекта: 8 токенов цвета, 2 шрифта и ни одного лишнего компонента. Меньше — лучше. #дизайн", createdAt: hoursAgo(2), likes: 47, comments: 6, reposts: 11 },
    { id: "p-05", authorId: "u-zhanna", text: "Чарынский каньон на рассвете — это другое измерение. Приезжайте к 5 утра, пока никого нет. Проверено. #чарын", createdAt: hoursAgo(3), likes: 73, comments: 14, reposts: 6 },
    { id: "p-06", authorId: "u-timur", text: "Пробежал первые 15 км без остановки. До Алматы Марафона осталось два месяца — и я уже чувствую финишную ленту. #бег", createdAt: hoursAgo(5), likes: 29, comments: 5, reposts: 2 },
    { id: "p-07", authorId: "u-yerzhan", text: "Плёночная фотография возвращается, и я этому очень рад. Цифра удобна, но плёнка учит думать до нажатия на кнопку.", createdAt: hoursAgo(8), likes: 41, comments: 8, reposts: 3 },
    { id: "p-08", authorId: "u-madina", text: "Закончила серию иллюстраций про казахские орнаменты в современном стиле. Скоро покажу все восемь работ. #дизайн", createdAt: hoursAgo(12), likes: 88, comments: 17, reposts: 22 },
    { id: "p-09", authorId: "u-dmitriy", text: "Продуктивность — это не делать больше, а делать меньше, но важное. Закрыл сегодня три тикета и ни разу не открыл ютуб. Победа.", createdAt: daysAgo(1), likes: 64, comments: 10, reposts: 5 },
    { id: "p-10", authorId: "u-aliya", text: "Первый пост в Bailanysta! Платформа, где казахстанские голоса звучат громче. Рада быть здесь ✦ #bailanysta", createdAt: daysAgo(1), likes: 112, comments: 24, reposts: 18 },
    { id: "p-11", authorId: "u-saule", text: "Устроила себе книжные выходные: чай, плед и стопка из трёх романов. Понедельник, подожди.", createdAt: daysAgo(1), likes: 52, comments: 9, reposts: 4 },
    { id: "p-12", authorId: "u-arman", text: "ИИ не заменит программистов. Он заменит программистов, которые не используют ИИ. Записывайте. #it", createdAt: daysAgo(2), likes: 143, comments: 31, reposts: 27 },
  ]);

  // Подписки Алины (как в моках Уровня 1)
  await db.insert(follows).values([
    { followerId: "u-aliya", followeeId: "u-dmitriy" },
    { followerId: "u-aliya", followeeId: "u-saule" },
    { followerId: "u-aliya", followeeId: "u-arman" },
    { followerId: "u-aliya", followeeId: "u-yerzhan" },
  ]);

  // Лайкнутый пост из моков
  await db.insert(postLikes).values([{ userId: "u-aliya", postId: "p-10" }]);

  console.log("Done.");
  process.exit(0); // close MySQL connection pool
}

seed();
