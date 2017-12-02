// Includes
var React = require('react'),
    ReactDOM = require('react-dom'),
    createReactClass = require('create-react-class'),
    classData = require('./class-list.json'),
    SemanticUI = require('semantic-ui-react'),
    Accordion = SemanticUI.Accordion;

var MainInterface = createReactClass({
    getInitialState: function() {
        this.getCourseInterests();
        return {
            selectedCategoryData: classData[0]
        } //return
    }, //getInitialState
    
    handleOnClick: function(categoryData) {
        this.setState({
           selectedCategoryData: categoryData 
        });
    },
    
    getCourseInterests: function() {
        fetch("/api/getCourseInterests").then((responseText) => {
            return responseText.json();
        })
        .then((response) => {
            classData = classData.map((classesCategory) => {
                classesCategory.classes = classesCategory.classes.map((course) => {
                    course.courseInterests = [];
                    response.courseInterests.forEach(function(courseInterest) {
                        if (courseInterest.department == course.department 
                        && courseInterest.courseNumber == course.courseNumber) {
                            course.courseInterests.push(courseInterest);
                        }
                    });
                    return course;
                });
                return classesCategory;
            });
            this.setState({selectedCategoryData: classData[0]});
        });
    },
    
    render: function()  {
        return (
            <div className="main-interface-wrapper">
                <CategoriesNav 
                    selectedCategory={this.state.selectedCategoryData} 
                    classData={classData} 
                    handleOnClick={this.handleOnClick}/>
                <ClassListContainer 
                    categoryData={this.state.selectedCategoryData} 
                    getCourseInterests={this.getCourseInterests}/>
            </div>
        )
    }
});

var CategoriesNav = createReactClass({
    render: function() {
        const classList = this.props.classData.map((category) => 
            <CategoryTab
                active={this.props.selectedCategory === category}
                categoryData={category} 
                handleOnClick={this.props.handleOnClick}/>
        );
        return (
            <div className={"category-nav"}>{classList}</div>
        )
    }
});

var CategoryTab = createReactClass({
    render: function() {
        return (
            <div 
                className={"category-tab" + (this.props.active ? " active" : "")} 
                onClick={() => this.props.handleOnClick(this.props.categoryData)}>
                {this.props.categoryData.displayName}
            </div>
        )
    } 
});

var AccordionComponent = createReactClass({
    getInitialState: function() { 
        return({
            activeIndex: -1
        })
    },

    handleClick: function(e, titleProps) {
        const { index, interestCount } = titleProps
        const { activeIndex } = this.state
        const newIndex = (activeIndex === index || (activeIndex == -1 && !interestCount )) ? -1 : index
        
        this.setState({ activeIndex: newIndex })
    },

  render: function() {
    const { activeIndex } = this.state;
    const interestTag = this.props.interestCount + 
        (this.props.interestCount === 1 ? " person is interested" : " people are interested");

    return (
        <Accordion styled fluid>
            <Accordion.Title 
                className="interests" 
                active={activeIndex === 0} 
                index={0} 
                interestCount={this.props.interestCount} 
                onClick={(e, titleProps) => this.handleClick(e, titleProps)}>
                <i className="dropdown icon"></i>
                <span className="interest-count">{interestTag}</span>
            </Accordion.Title>
            <Accordion.Content 
                active={activeIndex === 0}>
                <div className="ui feed">
                    {this.props.events}
                </div>
            </Accordion.Content>
        </Accordion>
    )
  }
});

var ClassCard = createReactClass({
    getInitialState: function() {
        return({
            firstName: "",
            lastName: "",
            comments: "",
            department: this.props.classData.department,
            courseNumber: this.props.classData.courseNumber
        });
    },
    
    handleFirstNameChange: function(e) {
        this.setState({ firstName: e.target.value });
    },
    
    handleLastNameChange: function(e) {
        this.setState({ lastName: e.target.value });
    },
    
    handleCommentsChange: function(e) {
        this.setState({ comments: e.target.value });
    },
    
    handleInterestedClick: function() {
        fetch("/api/createCourseInterest", 
            {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(this.state)
            }
        ).then((response) => {
            this.getInitialState();
            this.props.getCourseInterests();
        });
        
    },
    
    render: function()  {
        const { classData } = this.props;
        var interestCount, interestEntries;
        if (classData.courseInterests) {
            interestCount = classData.courseInterests.length;
            interestEntries = classData.courseInterests.map((courseInterest) => {
                return (
                    <div className="event">
                        <div className="label">
                          <i className="comment outline icon"></i>
                        </div>
                        <div className="content">
                            <div className="summary">
                                {courseInterest.firstName + " " + courseInterest.lastName + " is interested."}
                            </div>
                            <div className="extra text">
                                {courseInterest.comments}
                            </div>
                        </div>
                    </div>
                )
            });
        }
        return (
            <div className="class-card my-card">
                <span className="class-heading">
                    <span className="class-official-name">{classData.department + " " + classData.courseNumber}</span>
                    {classData.name}
                </span>
                <AccordionComponent events={interestEntries} interestCount={interestCount}/>
                <div className="ui form">
                    <label style={{fontWeight: "bold"}}>Name: </label>
                    <div className="two fields">
                        <div className="field">
                            <input type="text" required="" placeholder="First name" value={this.state.firstName} onChange={this.handleFirstNameChange}/>
                        </div>
                        <div className="field">
                            <input type="text" required="" placeholder="Last name" value={this.state.lastName} onChange={this.handleLastNameChange}/>
                        </div>
                    </div>
                    <div className="field">
                        <label>Comments:</label>
                        <textarea rows="2" cols="35" 
                            name="comments" 
                            placeholder="I'm planning on taking this class at 9:30am."
                            value={this.state.comments}
                            onChange={this.handleCommentsChange}/>
                    </div>
                    <button className="ui button" onClick={this.handleInterestedClick}>Interested</button>
                </div>
            </div>
        )
    }
});

var ClassListContainer = createReactClass({
    render: function() {
        const classList = this.props.categoryData.classes.map((currentClass) =>
            <ClassCard 
                classData={currentClass} 
                getCourseInterests={this.props.getCourseInterests}/>
        );
        return (
            <div className="class-list-container">{classList}</div>
        )
    }
});

ReactDOM.render(<MainInterface/>, document.getElementById('main-interface'));