const Course = ({course}) => {

    const Total = course.parts.reduce((sum, part) => {
        return sum + part.exercises
    }, 0)

    return (
        <div>
            <h1>{course.name}</h1>
            {course.parts.map((part) => <p>{part.name} {part.exercises}</p>)}
            <strong>Total of {Total} courses</strong>
        </div>
    )
}

export default Course