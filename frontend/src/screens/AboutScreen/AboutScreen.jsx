import './AboutScreen.css'

const AboutScreen = () => {
    return (
        <div className='about-general-container'>

            <div className='about-container1'>
                <h1 className='about-h1'> About me... </h1>
                <h3 className='about-h3'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque repellendus vero deleniti aliquam nulla veritatis rem? Veritatis sapiente nisi consequuntur beatae. Excepturi eveniet eius incidunt omnis, deserunt fugiat quae minima.
                    Lorem ipsum dolor sit, amet consectetur adipisicing elit. Saepe vitae fuga minima repellendus, ducimus veritatis corporis officiis, quas iure soluta aperiam sit quo consequatur ullam dignissimos vel aspernatur animi inventore.
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptates totam aliquam, itaque libero ab nisi repellendus velit deserunt quibusdam pariatur sequi, nobis omnis dicta nihil ducimus aspernatur beatae rerum ut!
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque neque dolores quisquam voluptatum voluptates maxime eaque, laboriosam delectus amet necessitatibus dolore dicta doloribus quo aut in natus magni quaerat sint.
                </h3>
            </div>

            <div className='about-container2'>

                <h2 className='about-h2'>Educational profile</h2>
                <div className='about-container3'>
                    <div className='column1'>
                        <p className='about-p'>mundosE </p>
                        <p className='about-p'>Inove </p>
                        <p className='about-p'>Coderhouse </p>
                        <p className='about-p'>ITMasters </p>
                        <p className='about-p'>UBA </p>
                        <p className='about-p'>Oxford University </p>
                    </div>
                    <div className='column2'>
                        <p className='about-p'>|  asdasd</p>
                        <p className='about-p'>|  asdasd</p>
                        <p className='about-p'>|  asdads</p>
                        <p className='about-p'>|  asdasd</p>
                        <p className='about-p'>|  asdasd</p>
                        <p className='about-p'>|  asdads</p>
                    </div>
                </div>

                <h2 className='about-h2'>Work Experience</h2>
                <div className='about-container3'>
                    <div className='column1'>
                        <p className='about-p'>2023 - up to date </p>
                        <p className='about-p'>2022 - up to date </p>
                        <p className='about-p'>2013 - 2023 </p>
                    </div>
                    <div className='column2'>
                        <p className='about-p'>|  FullStack Dev. / Data Engineer</p>
                        <p className='about-p'>|  FrontEnd Dev. (Freelancer)</p>
                        <p className='about-p'>|  Chief Officer</p>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default AboutScreen