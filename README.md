# confirmacio-panells

Assistent per a la generació de la proposta de dotació de panells digitals i material complementari als centres públics de Catalunya, en el marc de les actuacions del programa #ecoDigEdu

L'aplicació està formada per dos components:

- Bakend (directori [api](./api) desenvolupat en PHP 8.1 que treballa amb una base de dades MySQL.

- Interfície d'usuari (directori [app](./app)), desenvolupada amb [React](https://react.dev/) i basada en [Material UI](https://mui.com/), que s'encapsula en forma de component web per tal de poder ser desplegada en qualsevol context. Actualment s'utilitza el servei Nodes del Departament d'Educació, basat en WordPress.


