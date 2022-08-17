module.exports = {
  token: "", // Токен бота
  client_id: "", // ID бота
  mongoURL: "", // Ссылка на подключение к MongoDB

  status: "online", // Статус бота: online, idle, invisible, dnd
  activity: "@minimalproject.ru", // Активность бота
  activity_type: "PLAYING", // Тип активности: PLAYING, STREAMING, WATCHING, LISTENING

  prefix: "!", // Префикс
  color: "#1ff994", // Цвет эмбеда
  index: "0.5", // Коэффициент для конвертации жалоб

  guild_id: "583564126757060616", // ID сервера

  shop: "992049467501072394", // ID канала магазина
  accept_shop: "992049467501072394", // ID канала уведомлений с магазина

  roles: "991793936249127104", // ID канала запроса роли
  accept_roles: "992040731923451904", // ID канала уведомлений с запроса роли

  private: "992076650080649246", // ID самого голосового канала
  private_category: "761651609679167498", // ID категории кастомных приватов
  private_text: "992039002863570974", // ID текст канала кастомных приватов

  application_channel: "", // ID канала заявок

  user: "761649969681530882", // ID роли игрока

  admin: [
    '761647732812808272', // Лидер команды
    '761648133897191455', // Команда проекта
    '761648663835050004', // Куратор
    '761648905821618197', // Гл. Администратор
    '761649047089971200', // Средний Администратор
    '761649312429375518' // Младший Администратор
  ], // Роли администраторов

  mainadmin: [
    '761647732812808272', // Лидер команды
    '761648133897191455', // Команда проекта
    '761648663835050004' // Куратор
  ], // Роли руководства

  // Товары
  // Курс 0.5
  // 50 жалоб - 25 коинов
  items: [
    // Подписки
    { id: 1, name: "Minimal+ 3 месяца", description: "Выдаёт в инвентарь minimal+ подписку на 3 месяца", image: "https://cdn-icons.flaticon.com/png/512/2221/premium/2221265.png?token=exp=1656605184~hmac=831cfca53af62c298c4335706114a219", price: "65" },
    { id: 2, name: "Minimal+ 6 месяца", description: "Выдаёт в инвентарь minimal+ подписку на 6 месяцев", image: "https://cdn-icons.flaticon.com/png/512/2221/premium/2221265.png?token=exp=1656605184~hmac=831cfca53af62c298c4335706114a219", price: "85" },
    { id: 3, name: "Minimal+ UNLIM", description: "Выдаёт в инвентарь minimal+ подписку на нескончаемый срок", image: "https://cdn-icons.flaticon.com/png/512/2221/premium/2221265.png?token=exp=1656605184~hmac=831cfca53af62c298c4335706114a219", price: "105" },
    // Тулы
    { id: 4, name: "Дубликатор", description: "Выдаёт доступ к инструменту", image: "https://cdn-icons-png.flaticon.com/512/627/627495.png", price: "40" },
    // Машины
    { id: 5, name: "Дрифтовый набор", description: "Выдаёт доступ к покупке машин из дрифтового набора", image: "https://cdn-icons-png.flaticon.com/512/148/148924.png", price: "40" },
    { id: 6, name: "Автомобильный номер", description: "Позволяет выбрать себе понравившиеся автомобильный номер", image: "https://cdn-icons-png.flaticon.com/512/149/149075.png", price: "25" },
    // Другое
    { id: 7, name: "+50 пропов к лимиту", description: "Дополнительный лимит", image: "https://cdn-icons-png.flaticon.com/512/148/148781.png", price: "25" },
    { id: 8, name: "Говорилка", description: "Придаёт к озвучке вами написанный текст на сервере", image: "https://cdn-icons-png.flaticon.com/512/149/149046.png", price: "25" },
    { id: 9, name: "Профессия организации", description: "После покупки вас перенаправит к консультанту для создания профессии.", image: "https://cdn-icons-png.flaticon.com/512/148/148905.png", price: "250" },
  ],

  giveroles: [
    '764933784058724372', // Фаворит
    '772769933322092565', // Какой-то смайлик
    '801140709985353748' // Медиа
  ], // Список всех ролей, которые могут быть выданы

  tags: {
    "JS": {
      roles: [
        {
          checkRole: "695387222819471380",
          giveRole: "764933784058724372"
        },
        {
          checkRole: "695387223218192475",
          giveRole: "772769933322092565"
        },
      ]
    },
    "DAO": {
      roles: [
        {
          checkRole: "0",
          giveRole: "801140709985353748"
        }
      ]
    }
  }
}
