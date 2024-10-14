<script setup lang="ts">
	import HeaderSubMenu from '@/components/Header/HeaderSubMenu.vue'
	import HeaderWrapper from '@/components/Header/HeaderWrapper.vue'
	import { mdiMagnify, mdiAccountCircleOutline } from '@mdi/js'
</script>

<template>
	<VApp class="toto">
		<div>random div</div>
		<HeaderWrapper>
			<template #menu>
				<ul>
					<li>
						<a>home</a>
					</li>
					<li>
						<a>profile</a>
					</li>
					<li>
						<HeaderSubMenu>
							<template #title>
								<a>sub menu</a>
							</template>
							<ul>
								<li>
									<a>sub menu item 1</a>
								</li>
								<li>
									<a>sub menu item 2</a>
								</li>
								<li>
									<HeaderSubMenu>
										<template #title>
											<a>+sub menu</a>
										</template>
										<ul>
											<li>
												<a>+sub menu item 1</a>
											</li>
											<li>
												<a>+sub menu item 2</a>
											</li>
											<li>
												<a>+sub menu item 3</a>
											</li>
										</ul>
									</HeaderSubMenu>
								</li>
							</ul>
						</HeaderSubMenu>
					</li>
				</ul>
			</template>
			<template #header-side>
				<div class="d-flex justify-center h-100 ga-4 pr-4">
					<VBtn
						variant="text"
						:prepend-icon="mdiMagnify"
						color="primary"
					>
						Rechercher
					</VBtn>
					<VBtn
						color="primary"
						:prepend-icon="mdiAccountCircleOutline"
					>
						Login
					</VBtn>
				</div>
			</template>
		</HeaderWrapper>
		<section>
			Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem eos quidem, inventore sit magni sequi explicabo obcaecati ut voluptate, cumque eveniet maxime, in architecto itaque unde minima vel aliquid minus.
			Ex minima nam doloribus magni! Beatae labore dolor aliquid cupiditate quasi blanditiis ducimus deserunt excepturi aliquam, nihil reiciendis, magnam quo consectetur a atque nobis tempore amet laudantium non dignissimos? Ut?
			Accusantium atque sed, fugiat incidunt maxime accusamus nihil, ipsam itaque amet ad dolorem neque numquam. Vel omnis vitae quibusdam deleniti unde laboriosam suscipit aut, commodi nam. Rerum libero provident dolor?
			Provident enim facilis quam excepturi nostrum consequatur placeat aut neque! Cum perferendis omnis modi accusantium sit ex quidem reprehenderit repudiandae eveniet error. Ad, aperiam architecto. Ratione quam molestias numquam fugit!
			Fugit maiores libero eos eligendi error magnam saepe, eius adipisci ad rerum cumque molestias blanditiis ab repellendus atque inventore iusto placeat dolorum. Placeat fugiat, tempore necessitatibus maxime quidem eius id.
			Numquam, accusantium ratione? Impedit ad, corrupti voluptate fugit vel, voluptates dicta saepe culpa aliquid repudiandae ratione, rerum harum odit labore nisi ipsam? Adipisci, alias labore nemo sunt accusamus iure assumenda.
			Ea quae aliquid minus libero distinctio architecto et aut, nemo beatae, autem vitae, eligendi possimus molestiae. Eius maiores culpa commodi vel velit. Alias dolorem sed impedit minima illum officia doloribus.
			Ut omnis officiis reiciendis consequatur fugit autem magnam nostrum, a culpa? Sit esse corrupti quis facere harum, quasi nisi tenetur maxime? Deleniti non quia incidunt minima cum quasi fuga ipsam.
			Alias ex aliquam praesentium error eaque consequuntur? Veritatis optio numquam et, aliquid fuga blanditiis dolorem ducimus, voluptatibus totam saepe minima neque? Eius ullam rerum aut. Corrupti distinctio blanditiis perspiciatis quam?
			Consequuntur provident eveniet repellendus, nisi voluptas unde tempore deleniti doloremque cupiditate commodi fuga dignissimos. Optio iste vel possimus adipisci, ipsa veritatis mollitia sapiente architecto eaque repudiandae ex laboriosam voluptas quibusdam?
			Officia rem maxime sapiente quod ipsam repellat vel voluptate? Ipsa quod nihil laborum odio, consequatur earum nobis ex consequuntur placeat optio aliquid tenetur blanditiis ipsam modi corrupti, dolorem doloremque eaque.
			Possimus perspiciatis suscipit facere labore cumque, necessitatibus omnis dolorem ut et deserunt mollitia debitis vitae eius veniam minus odit distinctio voluptatem quas quaerat voluptates qui. Dolore temporibus maxime dolorum eum?
			Inventore reiciendis dicta quia reprehenderit? Quis iste id officia perspiciatis sunt voluptates libero laudantium aliquam molestias, sit nulla facilis numquam delectus cumque nam necessitatibus asperiores similique culpa aspernatur, atque neque?
			Maxime rerum voluptatem dolorum impedit illum in, animi tempora, atque quibusdam sit perferendis. Rerum, quia non. Aspernatur debitis ab et tempora. Ullam dignissimos et distinctio hic. Voluptatum alias delectus maiores!
			Libero hic maiores laborum natus dolorem vitae eius quibusdam veritatis, quia ullam blanditiis sapiente ipsa totam commodi aliquam, sed iure odit saepe velit? Rem commodi alias totam possimus esse necessitatibus?
			Consequuntur, officiis voluptates! Voluptas quos ducimus ex possimus asperiores cum, debitis et omnis, voluptatibus aliquam animi aliquid explicabo necessitatibus? Nulla atque saepe in hic maxime aut vitae voluptatem tenetur voluptas!
			Nesciunt, non doloremque! Accusantium quia magni officiis illum nam unde deserunt hic. Exercitationem illum repellat, iure praesentium similique vitae voluptate nulla ipsam debitis ab accusantium aliquid quia nemo optio quod.
			Amet aspernatur, ad consectetur eos alias nisi, harum, mollitia fugit atque saepe cumque! Dolore fuga eveniet, laborum explicabo asperiores quos quaerat nesciunt modi voluptatum nihil et, quod quam, consequatur inventore?
			Atque deleniti, suscipit cupiditate odit quia nam totam fugit quisquam accusamus similique dolores architecto aliquam harum adipisci iste quibusdam voluptas ipsam a molestiae dicta minima quidem perspiciatis est. Iste, repellat?
			Sint excepturi qui, commodi suscipit repudiandae maxime reiciendis at nulla? Ipsum, voluptatibus numquam nobis alias nostrum magnam aperiam quidem voluptas earum pariatur, debitis vel. Mollitia minus repellendus aspernatur rem iusto?
			Assumenda dolore nam facere eaque optio commodi aspernatur autem voluptatibus. Repudiandae enim, reprehenderit dolorem quod deleniti modi laboriosam distinctio, a quisquam tenetur in quis nam est repellat libero assumenda atque.
			Neque, cum temporibus aliquid eligendi alias laborum necessitatibus aliquam praesentium beatae illum culpa perspiciatis delectus maiores ea doloribus ullam reprehenderit maxime obcaecati excepturi, deserunt expedita. Eveniet repudiandae ipsum porro sunt.
			Accusantium harum ipsum cum temporibus placeat autem eligendi et sed voluptatem? Minima aliquid omnis sunt ullam, nisi sint officia delectus quidem laudantium necessitatibus distinctio tenetur consectetur dolorum, facere vero veritatis!
			Alias soluta quam nam recusandae eveniet odit voluptas? Optio asperiores explicabo quisquam! Laudantium ratione labore iure nesciunt quae sapiente ut dignissimos esse, neque veritatis facere, necessitatibus quod similique eum dolore.
			Enim libero repudiandae ducimus laborum, odit quod dicta tenetur fugiat illum nisi blanditiis quae esse non consectetur maxime deleniti incidunt delectus saepe recusandae rerum, sit sunt? Earum recusandae commodi numquam!
			Quisquam eum quidem dolores cum esse quia ratione aliquam quos ipsum ex reiciendis non corporis consequatur exercitationem iure nam suscipit nobis maxime, veniam dolorum soluta animi itaque fuga doloribus? Deserunt.
			Culpa velit sit asperiores in harum vel, illo enim deleniti, libero obcaecati esse beatae blanditiis repellat excepturi tenetur dolorum autem hic ratione. Dolores autem magnam, molestiae adipisci possimus eius id.
			Excepturi a placeat culpa aut ipsum modi laborum, non, odio ex sequi nam sit totam repellendus! Cumque dolore fugit similique, minima sed distinctio delectus at perspiciatis officiis, aperiam odio molestias?
			Ipsam blanditiis itaque distinctio delectus commodi? Quibusdam voluptatem incidunt doloribus, eaque libero doloremque. Sed praesentium ipsa totam amet aliquam at ratione, quis velit porro, cum minima qui iusto, quidem natus.
			Nesciunt excepturi aliquid beatae, sed asperiores debitis vel eos quaerat esse minus suscipit similique, recusandae ipsam non doloremque velit consequatur a maiores, deleniti natus temporibus inventore sequi expedita. Ad, atque.
			Fugiat libero commodi animi, sint explicabo dolores corrupti pariatur accusantium dolorum quam cupiditate? Voluptate molestiae, libero excepturi, enim, odio ea nesciunt fuga quisquam ut quo assumenda. Minima ipsa vero quis.
			Fuga numquam, beatae in tenetur quasi unde expedita, hic dolorum illum laborum soluta omnis, labore saepe. Sunt temporibus laudantium iusto libero sint amet, ab dicta nobis rerum deleniti. Saepe, accusantium.
			Neque incidunt debitis id fugit magni. Mollitia voluptas expedita voluptates dolore qui, doloremque omnis sapiente odit sed excepturi blanditiis labore rem aliquid molestias doloribus aliquam non quis ipsum illum. Qui.
			Omnis sunt quam distinctio maxime delectus corrupti odit voluptatem quibusdam consequatur? Eos enim rem corporis sequi tenetur exercitationem! Officia totam recusandae architecto? Reprehenderit, et beatae dignissimos debitis quae at ex?
			Quo alias cupiditate quia. Explicabo soluta veniam commodi quis nihil magnam cupiditate sed minima. Eaque possimus vitae excepturi laudantium impedit eligendi natus ut commodi, illum, placeat rem quidem aut quasi.
			Dolor dolores suscipit totam excepturi aliquid unde qui obcaecati quisquam nostrum eius recusandae amet neque nemo odit corporis hic, ab quibusdam! Exercitationem, ratione nemo! Totam quidem tenetur qui eveniet minus.
			Sunt tenetur saepe quod voluptatum in necessitatibus dolore suscipit nisi libero esse iure exercitationem, consequatur ab ex incidunt error, voluptatem sed eaque sint, eveniet ut quisquam cum? Quam, quis quaerat.
			Qui expedita sapiente soluta asperiores itaque fugit sequi consequuntur fuga deleniti voluptates debitis, quia odio consequatur nobis quis perferendis quos. Porro, architecto! Quo dicta fugiat recusandae commodi in accusantium temporibus.
			A ullam autem in, aliquid reiciendis id et. Esse mollitia odit maiores praesentium omnis fugiat est ab voluptatum quasi similique dolor ullam eaque, error vero ducimus quia, modi laudantium non!
			Aspernatur aperiam iusto asperiores voluptas labore, dolore mollitia illum iste nobis velit, accusamus, distinctio deserunt laborum qui nesciunt laboriosam assumenda animi commodi! Libero ullam tempore assumenda necessitatibus tempora eos veritatis!
			Impedit dolore ea illo omnis possimus commodi, nisi inventore. Quos itaque molestiae alias eveniet, repellat voluptate ullam consequatur vel deleniti modi ad dolores autem maxime asperiores totam quo odio assumenda.
			Ab sed quam beatae nemo ut error. Excepturi optio assumenda ullam nostrum dolore tenetur qui expedita nesciunt, praesentium a illum consectetur maiores veniam similique, reiciendis cumque minima id voluptatum sed!
			Ab, eius est expedita accusantium tenetur totam accusamus rerum harum velit sit labore possimus natus quibusdam reiciendis, vel ratione illum? Ducimus commodi veniam soluta cumque aliquam et, amet accusamus suscipit.
			Unde voluptatibus iusto ratione eveniet, distinctio magni in officiis debitis. Animi alias voluptate iste placeat ullam, fuga molestiae fugit saepe, suscipit ut consequatur amet vel voluptas unde illum quasi atque!
			Accusantium quidem vel possimus consectetur, ipsa reprehenderit inventore veritatis! Officia provident illo sequi iste veniam est ex at eum. Tempore maiores quidem inventore? Maiores libero cumque consectetur iusto quis. Adipisci.
			Temporibus aspernatur quam animi accusantium commodi, et, necessitatibus dolor libero possimus quas nobis officia laborum eveniet corporis! Qui consectetur atque labore quod sint, architecto exercitationem maiores, aspernatur ut eum vero.
			Vitae ullam nisi ipsum eum exercitationem deleniti maiores tenetur? Rem inventore voluptates beatae consequatur, ullam nulla soluta nemo repudiandae repellendus magnam et porro iusto itaque facere rerum quisquam atque eligendi.
			Sequi quasi, quos iure doloremque maxime ab eius aliquid ipsa, obcaecati impedit officiis porro fugiat ad dolor rerum dicta? Autem quibusdam dicta harum, ad eum doloremque cupiditate amet explicabo doloribus.
			Quis eveniet porro ducimus fugiat tenetur, at officia. Eaque fugiat animi perferendis quo, eligendi quae soluta doloribus delectus repellat aspernatur mollitia corporis, earum voluptate maxime repellendus? Nisi unde nesciunt nihil?
			Accusamus perferendis aut nihil animi deserunt velit nisi, accusantium veniam dolorum aliquam iusto nostrum similique, adipisci magnam magni quae temporibus beatae quia? Nisi inventore, velit libero recusandae laboriosam expedita pariatur!
		</section>
	</VApp>
</template>

<style scoped>
    .toto {
        max-width: 850px;
        margin: 0 auto;
    }
</style>
