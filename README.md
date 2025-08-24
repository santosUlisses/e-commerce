Sistema de e-commerce 
O sistema foi desenvolvido com o objetivo de simular um site real de compras/vendas de produtos. O sistema possui as funcionalidades de criação de usuário,válidação de login, e painel exclusivo para cada tipo
de usuário. o painel de usuário possui as funcionalidades: Enviar solicitação para ser vendedor, edição de dados cadastrais, visualização de produtos disponíveis para commpras, carrinho de compras e ao finalizar a compra, o usuário vai para a página de pagamento pix.
painel de vendedor: Adiciona,edita e exclui produtos, visualiza as vendas e o total de cada produto vendido.
painel de administrador : adiciona categorias de produtos, aceita e recusa as solicitações para o usuário ser vendedor e edita o tipo de usuário de vendedor para usuário comum.
foram utilizadas as seguintes tecnologias : bootstrap para o visual do front end, handlebars para os templates. para o back end foi utilizado nodeJs,express,bcrypt e a ORM Sequelize para a conexão e consultas ao
banco de dados.


# 🛒 Sistema de E-commerce

Este projeto foi desenvolvido com o objetivo de simular um site real de compras e vendas de produtos, oferecendo diferentes níveis de acesso para usuário, vendedor e administrador.
Funcionalidades:

Usuário:
- Criar conta e realizar login (com validação).
- Editar dados cadastrais.
- Visualizar produtos disponíveis para compra.
- Adicionar produtos ao carrinho.
- Finalizar compra e acessar a **página de pagamento via Pix**.
- Solicitar permissão para se tornar vendedor.

Vendedor:
- Adicionar novos produtos.
- Editar e excluir produtos.
- Visualizar vendas realizadas.
- Consultar o total de cada produto vendido.

Administrador:
- Adicionar categorias de produtos.
- Aceitar ou recusar solicitações para transformar usuários em vendedores.
- Alterar o tipo de usuário (vendedor ↔ usuário comum).

Tecnologias Utilizadas:
- Front-end: Bootstrap, Handlebars
- Back-end: Node.js, Express
- Banco de Dados: MySQL (via Sequelize ORM)
- Segurança: Bcrypt (hash de senhas)
- Pagamentos: Pix-Static (geração de QR Code Pix)
- dotenv para configuração de variáveis de ambiente


Painel admin : 

<img width="1919" height="602" alt="painel admin" src="https://github.com/user-attachments/assets/4d1ab2b3-20ea-4e58-bbfe-1c2100ccc8eb" />

<img width="1919" height="907" alt="categorias" src="https://github.com/user-attachments/assets/80ec5706-f808-4097-ad0f-d9639e4b9702" />

<img width="1919" height="738" alt="solicitações" src="https://github.com/user-attachments/assets/8e543a4e-8a66-4550-a717-541a0cc7ede5" />

<img width="1919" height="637" alt="vendedores" src="https://github.com/user-attachments/assets/77484434-b2e6-4d7c-863e-8517b6f37d3a" />
<br><br><br><br>

Painel vendedor : 
<img width="1919" height="686" alt="painel vendedor" src="https://github.com/user-attachments/assets/ca1038a9-4c05-4c8a-b3ed-f041479535b5" />

<img width="1919" height="910" alt="produtos do vendedor" src="https://github.com/user-attachments/assets/f54fc723-320e-4edb-8fa9-dc5126c690c8" />

<img width="1919" height="906" alt="vendas" src="https://github.com/user-attachments/assets/bddfaa30-006d-4a2f-88f3-47c67ab2525a" />
<br><br><br><br>


Painel usuario : 

<img width="1919" height="753" alt="painel usuario" src="https://github.com/user-attachments/assets/736fcbea-a904-4d31-a573-619b412dcf8e" />

<img width="1919" height="891" alt="produtos a venda" src="https://github.com/user-attachments/assets/fdde9f1e-79ee-4c0c-b3a8-3832c717203b" />

<img width="1919" height="753" alt="carrinho usuario" src="https://github.com/user-attachments/assets/8c6056ba-49a7-4fcc-94f5-54b57d434f14" />

<img width="1919" height="908" alt="pagamento" src="https://github.com/user-attachments/assets/16735c44-1d89-4fea-bf2d-d279db8db8e7" />

<img width="1919" height="884" alt="compras" src="https://github.com/user-attachments/assets/8391b20a-120f-4861-9edf-f564889fd417" />

