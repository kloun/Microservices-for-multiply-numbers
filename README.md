# Развертывание микросервисов на Node.js

Чтобы развернуть микросервисы, нужно выполнить следующие действия:

1. Установить node.js и npm.
2. Установить зависимости обеих проектов командой `npm install` в каталогах m1 и m2.
3. Установить rabbitmq командой `apt install  rabbitmq-server` для ОС на базе Debian (проверял на ubuntu 23.10) или используя docker-образ.
4. Запустить микросервисы командой `node m1/index.js` и `node m2/index.js` (если порт 3000 не устраивает - замените в  `m1/index.js`, константа `port`).
5. Откройте Postman и отправьте POST-запрос на адрес http://localhost:3000/multiplyByTwo (заменив имя хоста или порт при необходимости) с  телом в формате JSON:
{
    "number": 1
}  
6. Получите ответ после пяти секунд ожидания `{"number":"2"}`q